const fs = require("fs");
const path = require("path");
const Job = require("../models/Job");

const uploadDir = path.join(__dirname, "../uploads");

const toNumber = (value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const saveBase64File = (base64Value, label) => {
  if (!base64Value) return undefined;

  const match = base64Value.match(/^data:(.+);base64,(.+)$/);
  if (!match) return undefined;

  const mimeType = match[1];
  const base64Data = match[2];
  const ext = mimeType.split("/")[1] || "bin";
  const fileName = `${label}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  fs.writeFileSync(path.join(uploadDir, fileName), base64Data, "base64");
  return fileName;
};

exports.createJob = async (req, res) => {
  try {
    const location = {
      city: req.body.city?.trim() || undefined,
      state: req.body.state?.trim() || undefined,
      lat: toNumber(req.body.lat),
      lng: toNumber(req.body.lng)
    };

    const documents = {
      resume: saveBase64File(req.body.resumeFile, "resume"),
      coverLetter: saveBase64File(req.body.coverLetterFile, "cover-letter"),
      offerLetter: saveBase64File(req.body.offerLetterFile, "offer-letter")
    };

    const job = await Job.create({
      title: req.body.title,
      company: req.body.company,
      status: req.body.status,
      deadline: req.body.deadline || undefined,
      location,
      documents,
      userId: req.user.id
    });

    res.json(job);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.send("Job deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    if (req.body.title !== undefined) job.title = req.body.title;
    if (req.body.company !== undefined) job.company = req.body.company;
    if (req.body.status !== undefined) job.status = req.body.status;
    if (req.body.deadline !== undefined) job.deadline = req.body.deadline || undefined;

    job.location = {
      city: req.body.city !== undefined ? req.body.city?.trim() || undefined : job.location?.city,
      state: req.body.state !== undefined ? req.body.state?.trim() || undefined : job.location?.state,
      lat: req.body.lat !== undefined ? toNumber(req.body.lat) : job.location?.lat,
      lng: req.body.lng !== undefined ? toNumber(req.body.lng) : job.location?.lng
    };

    if (req.body.resumeFile) {
      job.documents.resume = saveBase64File(req.body.resumeFile, "resume");
    }
    if (req.body.coverLetterFile) {
      job.documents.coverLetter = saveBase64File(req.body.coverLetterFile, "cover-letter");
    }
    if (req.body.offerLetterFile) {
      job.documents.offerLetter = saveBase64File(req.body.offerLetterFile, "offer-letter");
    }

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).send(err.message);
  }
};