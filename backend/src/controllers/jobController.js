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
  const { skills } = req.body; // Expecting a comma-separated string of skills
  if (!skills) {
    return res.status(400).json({ message: "Skills are required." });
  }

  try {
    const userSkills = skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase()); // Normalize input
    const jobs = await Job.find();

    const results = jobs.map((job) => {
      const matchedSkills = userSkills
        .filter((userSkill) =>
          job.requiredSkills.some(
            (requiredSkill) => requiredSkill.toLowerCase() === userSkill // Normalize required skills
          )
        )
        .map((s) => s.toUpperCase()); // Capitalize matched skills

      const relevance =
        (matchedSkills.length / job.requiredSkills.length) * 100;

      return {
        title: job.title,
        relevance: relevance.toFixed(2), // Keep relevance as a percentage string
        comment: matchedSkills.length
          ? `Your skills in <b>${matchedSkills.join(
              ", "
            )}</b> align with this role.`
          : null,
        suggestions: job.suggestedSkills,
      };
    });

    // Sort results by relevance in descending order
    results.sort((a, b) => b.relevance - a.relevance);

    // console.log("Sorted Results:", results); // Debugging line to verify sorted results

    res.status(200).json(results.filter((job) => job.relevance > 0)); // Only send jobs with > 0 relevance
  } catch (error) {
    res
      .status(500)
      .json({ message: "Job matching failed.", error: error.message });
  }
};

module.exports = { getJobs, matchJobs };
