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

  // Initialize the Trie on component mount
  useEffect(() => {
    const trieInstance = new Trie();
    skills.forEach((skill) => trieInstance.insert(skill));
    setTrie(trieInstance);
  }, []);

  const handleSkillSelect = (skill) => {
    // Add skill to selected skills if not already added
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSearch = async () => {
    try {
      setError("");
      const data = await fetchMatchedJobs(selectedSkills.join(", "));
      setResults(data);
    } catch (err) {
      setError("Failed to fetch matched jobs. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600">Job Skill Matcher</h1>
      <p className="mt-2 text-gray-700">Find the perfect job for your skills!</p>
      <SearchBar trie={trie} onSkillSelect={handleSkillSelect} />
      {selectedSkills.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Skills:</h2>
          <ul className="mt-2">
            {selectedSkills.map((skill, idx) => (
              <li key={idx} className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full m-1">
                {skill}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSearch}
            className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <Results results={results} />
    </div>
  );
}

export default App;
