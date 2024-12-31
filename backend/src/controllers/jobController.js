const Job = require("../models/Jobs.js");

// Example handler to fetch all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the database
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs.", error: error.message });
  }
};

module.exports = { getJobs };
