const express = require("express");
const { getJobs } = require("../controllers/jobController");

const router = express.Router();

// Route to fetch jobs
router.get("/", getJobs);

module.exports = router;