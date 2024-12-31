const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./models/Jobs.js");

dotenv.config();

const jobs = [
  {
    title: "Frontend Developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    suggestedSkills: ["Redux", "TypeScript"],
  },
  {
    title: "Backend Developer",
    requiredSkills: ["Node.js", "Python", "SQL", "MongoDB"],
    suggestedSkills: ["Docker", "Kubernetes"],
  },
  {
    title: "Full Stack Developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "Node.js", "React"],
    suggestedSkills: ["TypeScript", "GraphQL"],
  },
  {
    title: "Data Analyst",
    requiredSkills: ["SQL", "Python", "Excel", "Tableau"],
    suggestedSkills: ["Power BI", "R"],
  },
  {
    title: "Network Administrator",
    requiredSkills: ["Networking", "Linux", "Cisco"],
    suggestedSkills: ["Firewall Management", "Cloud Networking"],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Clear existing data
    await Job.deleteMany();
    console.log("Existing jobs cleared");

    // Insert seed data
    await Job.insertMany(jobs);
    console.log("Job data seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
