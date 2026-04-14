const Job = require("../models/Job");
const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");

const HOUR_MS = 60 * 60 * 1000;

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const sendDeadlineReminders = async () => {
  const { start, end } = getTodayRange();

  const jobs = await Job.find({
    deadline: { $gte: start, $lte: end },
    deadlineReminderSentAt: { $exists: false },
  });

  if (!jobs.length) {
    return;
  }

  const userIds = [...new Set(jobs.map((job) => job.userId).filter(Boolean))];
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = new Map(users.map((user) => [String(user._id), user]));

  for (const job of jobs) {
    const user = userMap.get(String(job.userId));

    if (!user || !user.email) {
      continue;
    }

    const subject = `Deadline reminder: ${job.title || "Internship application"}`;
    const text = `Hi ${user.name},\n\nThis is a reminder that your internship application deadline is today for ${job.title || "your role"} at ${job.company || "the company"}.\n\n- InternTrack`;

    const sent = await sendEmail({
      to: user.email,
      subject,
      text,
      html: `<p>Hi ${user.name},</p><p>This is a reminder that your internship application deadline is <strong>today</strong> for <strong>${job.title || "your role"}</strong> at <strong>${job.company || "the company"}</strong>.</p><p>- InternTrack</p>`,
    });

    if (sent) {
      job.deadlineReminderSentAt = new Date();
      await job.save();
    }
  }
};

exports.startReminderScheduler = () => {
  sendDeadlineReminders().catch((error) => {
    console.error("Initial reminder check failed:", error.message);
  });

  setInterval(() => {
    sendDeadlineReminders().catch((error) => {
      console.error("Reminder check failed:", error.message);
    });
  }, HOUR_MS);
};
