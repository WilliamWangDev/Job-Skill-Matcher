import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    // Check if the onSearch prop is defined
    if (onSearch) {
      onSearch(input);
    }
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Enter your skills (e.g., JavaScript, Python)"
        value={input}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        onClick={handleSearch}
        className="mt-2 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
