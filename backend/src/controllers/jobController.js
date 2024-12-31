const Job = require("../models/Jobs.js");
const Fuse = require("fuse.js"); // Install Fuse.js in the backend: npm install fuse.js

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

// Fuzzy match jobs based on user input
const matchJobs = async (req, res) => {
  const { skills } = req.body; // Expecting skills as a comma-separated string
  if (!skills) {
    return res.status(400).json({ message: "Skills are required." });
  }

  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();

    // Initialize Fuse.js
    const fuse = new Fuse(jobs, {
      keys: ["requiredSkills"], // Match against the requiredSkills field
      threshold: 0.3, // Adjust threshold for leniency
    });

    // Split user input into individual skills
    const userSkills = skills.split(",").map((skill) => skill.trim());

    // Perform matching
    const results = jobs
      .map((job) => {
        // Match userSkills to requiredSkills of this job
        const matchedSkills = userSkills.filter((userSkill) =>
          job.requiredSkills.some(
            (requiredSkill) =>
              requiredSkill.toLowerCase().includes(userSkill.toLowerCase()) // Case-insensitive match
          )
        );

        // Calculate relevance as a percentage
        const relevance =
          (matchedSkills.length / job.requiredSkills.length) * 100;

        return {
          title: job.title,
          relevance: relevance.toFixed(2), // Round relevance to two decimals
          comment: matchedSkills.length
            ? `Your skills in ${matchedSkills.join(", ")} align with this role.`
            : null, // No comment if no skills match
          suggestions: job.suggestedSkills,
        };
      })
      .filter((job) => job.relevance > 0); // Exclude jobs with relevance === 0

    // Sort results by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Job matching failed.", error: error.message });
  }
};

module.exports = { getJobs, matchJobs };
