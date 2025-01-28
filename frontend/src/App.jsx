import React, { useState, useEffect } from "react";
import Trie from "./utils/Trie";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Footer from "./components/Footer";
import { fetchMatchedJobs } from "./services/api";
import axios from "axios";
import jobsData from "./data/jobs.json"; // Import local jobs JSON
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Tooltip } from "react-tooltip";

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
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      handleSearch(updatedSkills);
    }
  };

  const handleRemoveSkill = (skill) => {
    const updatedSkills = [...selectedSkills].filter((s) => s !== skill);
    setSelectedSkills([...updatedSkills]);
    if (updatedSkills.length === 0) {
      handleReset(); // Reset search if no skills are selected
    } else {
      handleSearch(updatedSkills); // Trigger search on skill removal
    }
  };

  const handleSearch = async (skills) => {
    try {
      setError("");
      setSearchPerformed(true);

      let resultsData;

      if (useBackend) {
        console.log("Fetching data from backend...");
        const response = await axios.post(
          "http://localhost:5000/api/jobs/match",
          {
            skills: skills.join(","),
          }
        );
        resultsData = response.data;
      } else {
        console.log("Using local JSON for search...");
        resultsData = jobsData.map((job) => {
          const matchedSkills = skills
            .filter((skill) =>
              job.requiredSkills
                .map((rs) => rs.toLowerCase())
                .includes(skill.toLowerCase())
            )
            .map((s) => s.toUpperCase());
          const relevance =
            (matchedSkills.length / job.requiredSkills.length) * 100;

          return {
            title: job.title,
            relevance: relevance.toFixed(2),
            comment: matchedSkills.length
              ? `Your skills in <b>${matchedSkills.join(
                  ", "
                )}</b> align with this role.`
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col md:items-center justify-center p-12 flex-1 gap-1">
        <h1 className="text-4xl font-bold text-blue-950 select-none">
          Job Skill Matcher
        </h1>
        <p className="mb-4 text-gray-700 select-none">
          Find the perfect job for your skills!
        </p>
        <div className="flex flex-row items-center gap-2 max-w-md w-full justify-center relative">
          <SearchBar trie={trie} onSkillSelect={handleSkillSelect} />
          <RestartAltIcon
            onClick={handleReset}
            className={
              `text-gray-500 cursor-pointer hover:text-gray-700 absolute right-[-40px]` +
              (selectedSkills.length === 0
                ? " pointer-events-none opacity-70"
                : "")
            }
            fontSize="large"
            data-tooltip-id="revert-tooltip"
            data-tooltip-content="Reset"
          ></RestartAltIcon>
        </div>
        <div className="mt-2 w-full max-w-md">
          {selectedSkills.length > 0 && (
            <ul className="mt-2 flex flex-wrap">
              {selectedSkills.map((skill, idx) => (
                <li
                  key={idx}
                  className="relative bg-blue-100 text-blue-900 px-4 py-2 rounded-full m-1 flex items-center shadow-sm hover:shadow-md uppercase"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-gray-700"
                    aria-label="Remove skill"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex gap-3">
            {/* <button
              onClick={() => handleSearch(selectedSkills)}
              disabled={selectedSkills.length === 0}
              className={`py-2 px-4 rounded-lg font-medium ${
                selectedSkills.length > 0
                  ? "bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Search
            </button> */}
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <Results results={results} searchPerformed={searchPerformed} />
        <Tooltip className="max-w-sm" id="revert-tooltip" />
      </main>
      <Footer />
    </div>
  );
}

export default App;
