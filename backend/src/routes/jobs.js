const express = require("express");
const { getJobs, matchJobs } = require("../controllers/jobController");
const Job = require("../models/Jobs.js");

const router = express.Router();

// Route to fetch jobs
router.get("/", getJobs);

// Route to fetch distinct skills
router.get("/skills", async (req, res) => {
  try {
    const jobs = await Job.find();
    const allSkills = new Set();
    jobs.forEach((job) => {
      job.requiredSkills.forEach((skill) => allSkills.add(skill));
      job.suggestedSkills.forEach((skill) => allSkills.add(skill));
    });
    res.status(200).json([...allSkills]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch skills.", error: error.message });
  }
});

// Route to match jobs based on skills
router.post("/match", matchJobs);

module.exports = router;
