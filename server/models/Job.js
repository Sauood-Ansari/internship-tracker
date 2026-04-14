const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    resume: String,
    coverLetter: String,
    offerLetter: String
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    lat: Number,
    lng: Number
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    status: String,
    deadline: Date,
    deadlineReminderSentAt: Date,
    userId: String,
    location: locationSchema,
    documents: documentSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
