import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { abbreviations } from "../utils/skills";

function SearchBar({ trie, onSkillSelect }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const skills = trie ? trie.search("") : []; // Get all skills from Trie
    const fuseInstance = new Fuse(skills, {
      includeScore: true,
      threshold: 0.3, // Adjust threshold for fuzzy matching
    });
    setFuse(fuseInstance);
  }, [trie]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Check for abbreviation match
    const abbrevMatch = abbreviations[value.toUpperCase()];
    const abbrevSuggestions = abbrevMatch ? [abbrevMatch] : [];

    // Trie-based suggestions
    const trieSuggestions = trie ? trie.search(value.trim()) : [];

    // Fuse-based fuzzy matching
    const fuseSuggestions = fuse
      ? fuse.search(value.trim()).map((result) => result.item)
      : [];

    // Combine and remove duplicates
    const mergedSuggestions = Array.from(
      new Set([...abbrevSuggestions, ...trieSuggestions, ...fuseSuggestions])
    );

    setSuggestions(mergedSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    onSkillSelect(suggestion); // Add selected skill
    setInput(""); // Clear input after selection
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Enter a skill or abbreviation (e.g., JS, Python)"
        value={input}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded-lg mt-2 p-2 bg-white shadow-md">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-1 hover:bg-gray-200 cursor-pointer"
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