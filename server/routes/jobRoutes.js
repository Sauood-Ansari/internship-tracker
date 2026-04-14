const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const { createJob, getJobs, deleteJob, updateJob } = require("../controllers/jobController");

router.post("/", auth, createJob);
router.get("/", auth, getJobs);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;
