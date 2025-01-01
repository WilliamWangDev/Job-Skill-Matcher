const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const healthRoutes = require("./routes/health");


const jobRoutes = require("./routes/jobs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/health", healthRoutes);

module.exports = app;