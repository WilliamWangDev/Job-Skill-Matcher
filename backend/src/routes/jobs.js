const express = require("express");
const { getJobs, matchJobs } = require("../controllers/jobController");

const router = express.Router();

// Route to fetch jobs
router.get("/", getJobs);

// Route to match jobs based on skills
router.post("/match", matchJobs);

module.exports = router;