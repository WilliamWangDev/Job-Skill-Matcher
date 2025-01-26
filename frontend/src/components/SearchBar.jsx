import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { abbreviations } from "../utils/skills";

function SearchBar({ trie, onSkillSelect }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    if (trie) {
      const skills = trie.search(""); // Get all skills from the Trie
      const fuseInstance = new Fuse(skills, {
        includeScore: true,
        threshold: 0.3, // Adjust for fuzzy matching leniency
      });
      setFuse(fuseInstance);
    }
  }, [trie]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Check for abbreviation matches
    const abbrevMatch = abbreviations[value.toUpperCase()];
    const abbrevSuggestions = abbrevMatch ? [abbrevMatch] : [];

    // Get Trie-based suggestions
    const trieSuggestions = trie ? trie.search(value.trim()) : [];

    // Get Fuse.js fuzzy suggestions
    const fuseSuggestions = fuse
      ? fuse.search(value.trim()).map((result) => result.item)
      : [];

    // Merge and remove duplicates
    const mergedSuggestions = Array.from(
      new Set([...abbrevSuggestions, ...trieSuggestions, ...fuseSuggestions])
    );

    setSuggestions(mergedSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    onSkillSelect(suggestion); // Pass the selected skill back to the parent
    setInput(""); // Clear the input field
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Enter a skill or abbreviation (e.g., JS, Python)"
        value={input}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      {suggestions.length > 0 && (
        <ul className="border border-gray-200 rounded-lg bg-white shadow-lg absolute mt-2 overflow-auto max-h-60 w-full max-w-md z-20">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 hover:bg-gray-100 cursor-pointer uppercase"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
