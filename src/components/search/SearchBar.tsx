// SearchBar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return; // avoid empty searches
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    onClose(); // optionally close the search bar after navigating
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center bg-gray-800 rounded overflow-hidden">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="flex-1 px-3 py-2 text-white bg-gray-800 focus:outline-none"
      />
      <button
        onClick={onClose}
        className="px-3 py-2 text-gray-400 hover:text-white font-bold"
      >
        ×
      </button>
      <button
        onClick={handleSearch}
        className="px-3 py-2 bg-teal-500 hover:bg-teal-600 transition text-white"
      >
        Search
      </button>
    </div>
  );
};
