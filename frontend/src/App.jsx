import React, { useState, useEffect } from "react";
import Trie from "./utils/Trie";
import { skills } from "./utils/skills";
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
  const [trie, setTrie] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if a search was performed

  // Initialize the Trie on component mount
  useEffect(() => {
    const trieInstance = new Trie();
    skills.forEach((skill) => trieInstance.insert(skill));
    setTrie(trieInstance);
  }, []);

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
      setSearchPerformed(true); // Mark search as performed
      const data = await fetchMatchedJobs(selectedSkills.join(", "));
      setResults(data);
    } catch (err) {
      setError("Failed to fetch matched jobs. Please try again.");
    }
  };

  const handleReset = () => {
    setSelectedSkills([]);
    setResults([]);
    setError("");
    setSearchPerformed(false); // Reset search state
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600">Job Skill Matcher</h1>
      <p className="mt-2 text-gray-700">
        Find the perfect job for your skills!
      </p>
      <SearchBar trie={trie} onSkillSelect={handleSkillSelect} />
      <div className="mt-4 w-full max-w-md">
        {selectedSkills.length > 0 && (
          <div className="mt-4 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Selected Skills:
            </h2>
            <ul className="mt-2 flex flex-wrap">
              {selectedSkills.map((skill, idx) => (
                <li
                  key={idx}
                  className="relative bg-blue-100 text-blue-600 px-4 py-2 rounded-full m-1 flex items-center shadow-sm"
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
          </div>
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
