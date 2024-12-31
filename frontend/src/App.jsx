import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import { fetchMatchedJobs } from "./services/api";

function App() {
  // We place the handleSearch function here instead of inside of the SearchBar component because
  // ...after the user clicks the Search button, what I wanna do depends on what I pass to the onSearch prop(handleSearch function) in the App component.
  // For example, I might want to make an API request to get job listings based on the user input or just display the user input in the console.
  // This way, I can define the behavior of the onSearch prop in the App component.
  // const handleSearch = (input) => {
  // console.log("User input:", input); // This will display the user input in the console for now as we haven't implemented the API request yet
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (input) => {
    try {
      setError(""); // Clear previous errors
      const data = await fetchMatchedJobs(input);
      setResults(data); // Update results with data from the backend
    } catch (err) {
      setError("Failed to fetch matched jobs. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600">Job Skill Matcher</h1>
      <p className="mt-2 text-gray-700">Find the perfect job for your skills!</p>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <Results results={results} />
    </div>
  );
}

export default App;
