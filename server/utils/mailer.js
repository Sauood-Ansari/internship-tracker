exports.sendEmail = async ({ to, subject, text, html }) => {
  const webhookUrl = process.env.MAIL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("MAIL_WEBHOOK_URL missing. Skipping email send.");
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MAIL_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.MAIL_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ to, subject, text, html }),
  });

  if (!response.ok) {
    throw new Error(`Email provider error: ${response.status}`);
  }

  return true;
};
