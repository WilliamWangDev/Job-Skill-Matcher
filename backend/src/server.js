const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});