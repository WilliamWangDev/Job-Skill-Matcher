import React, { useState, useEffect } from "react";
import Trie from "./utils/Trie";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import { fetchMatchedJobs } from "./services/api";
import axios from "axios";
import jobsData from "./data/jobs.json"; // Import local jobs JSON

function App() {
  // We place the handleSearch function here instead of inside of the SearchBar component because
  // ...after the user clicks the Search button, what I wanna do depends on what I pass to the onSearch prop(handleSearch function) in the App component.
  // For example, I might want to make an API request to get job listings based on the user input or just display the user input in the console.
  // This way, I can define the behavior of the onSearch prop in the App component.
  // const handleSearch = (input) => {
  // console.log("User input:", input); // This will display the user input in the console for now as we haven't implemented the API request yet
  const [trie, setTrie] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  const [useBackend, setUseBackend] = useState(false); // Dynamic mode switching
  const [searchPerformed, setSearchPerformed] = useState(false);
  console.log("Imported jobs data:", jobsData);
  useEffect(() => {
    const initializeApp = async () => {
      let backendAvailable = false; // Local variable to manage backend availability

      try {
        // Check if the backend is running
        const response = await axios.get("http://localhost:5000/api/health");
        if (response.status === 200) {
          console.log("Using backend");
          backendAvailable = true;
          setUseBackend(true); // Use backend mode
        } else {
          console.log("Unexpected response from backend");
          setUseBackend(false); // Fallback to local JSON
        }
      } catch (error) {
        // Handle backend unavailability gracefully
        if (error.code === "ERR_NETWORK") {
          console.warn("Backend is not reachable. Falling back to local JSON.");
        } else {
          console.error("An unexpected error occurred:", error);
        }
        backendAvailable = false;
        setUseBackend(false); // Fallback to local JSON
      }

      // Load job data
      const fetchData = async () => {
        try {
          if (backendAvailable) {
            console.log("Fetching skills from backend...");
            const response = await axios.get(
              "http://localhost:5000/api/jobs/skills"
            );
            return response.data;
          } else {
            console.log("Using local JSON for skills...");
            const skills = new Set();
            jobsData.forEach((job) => {
              job.requiredSkills.forEach((skill) => skills.add(skill));
              job.suggestedSkills.forEach((skill) => skills.add(skill));
            });
            const skillsArray = [...skills];
            console.log("Local skills:", skillsArray);
            return skillsArray;
          }
        } catch (err) {
          console.error("Failed to load skills:", err);
          return [];
        }
      };

      const skills = await fetchData();

      // Initialize the Trie
      const trieInstance = new Trie();
      skills.forEach((skill) => trieInstance.insert(skill));
      setTrie(trieInstance);
    };

    initializeApp();
  }, []); // Keep dependency array constant

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSearch = async () => {
    try {
      setError("");
      setSearchPerformed(true);

      let resultsData;

      if (useBackend) {
        console.log("Fetching data from backend...");
        const response = await axios.post(
          "http://localhost:5000/api/jobs/match",
          {
            skills: selectedSkills.join(","),
          }
        );
        resultsData = response.data;
      } else {
        console.log("Using local JSON for search...");
        resultsData = jobsData.map((job) => {
          const matchedSkills = selectedSkills.filter((skill) =>
            job.requiredSkills
              .map((rs) => rs.toLowerCase())
              .includes(skill.toLowerCase())
          );
          const relevance =
            (matchedSkills.length / job.requiredSkills.length) * 100;

          return {
            title: job.title,
            relevance: relevance.toFixed(2),
            comment: matchedSkills.length
              ? `Your skills in ${matchedSkills.join(
                  ", "
                )} align with this role.`
              : null,
            suggestions: job.suggestedSkills,
          };
        });

        resultsData = resultsData.filter((job) => job.relevance > 0);
        resultsData.sort((a, b) => b.relevance - a.relevance);
      }

      setResults(resultsData);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch matched jobs. Please try again.");
    }
  };

  const handleReset = () => {
    setSelectedSkills([]);
    setResults([]);
    setError("");
    setSearchPerformed(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-12">
      <h1 className="text-3xl font-bold text-blue-800">Job Skill Matcher</h1>
      <p className="my-2 text-gray-700">
        Find the perfect job for your skills!
      </p>
      <SearchBar trie={trie} onSkillSelect={handleSkillSelect} />
      <div className="mt-2 w-full max-w-md">
        {selectedSkills.length > 0 && (
          <ul className="mt-2 flex flex-wrap">
            {selectedSkills.map((skill, idx) => (
              <li
                key={idx}
                className="relative bg-blue-100 text-blue-800 px-4 py-2 rounded-full m-1 flex items-center shadow-sm"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
                  aria-label="Remove skill"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleSearch}
            disabled={selectedSkills.length === 0}
            className={`p-2 rounded-lg ${
              selectedSkills.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <Results results={results} searchPerformed={searchPerformed} />
    </div>
  );
}

export default App;
