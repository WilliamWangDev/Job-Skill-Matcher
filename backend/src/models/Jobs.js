const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  requiredSkills: { type: [String], required: true },
  suggestedSkills: { type: [String], default: [] },
});

module.exports = mongoose.model("Job", JobSchema);