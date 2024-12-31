const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const jobRoutes = require("./routes/jobs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/jobs", jobRoutes);

module.exports = app;