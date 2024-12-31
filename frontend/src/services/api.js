import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to send skills to the backend and get matched jobs
export const fetchMatchedJobs = async (skills) => {
  try {
    const response = await apiClient.post("/jobs/match", { skills });
    return response.data;
  } catch (error) {
    console.error("Error fetching matched jobs:", error.response?.data || error.message);
    throw error;
  }
};