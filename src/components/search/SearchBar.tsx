// SearchBar.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onClose: () => void;
}

export const SearchBar = ({ onClose }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced API call for suggestions
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q.trim()) return setSuggestions([]);
        // Replace this fetch with your API endpoint
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}`);
        const data: string[] = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSearch = (q: string = query) => {
    if (!q.trim()) return;
    navigate(`/search?query=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSuggestions.cancel();
      handleSearch();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center bg-gray-800 rounded overflow-hidden w-full max-w-md"
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
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
        onClick={() => {
          fetchSuggestions.cancel();
          handleSearch();
        }}
        className="px-3 py-2 bg-teal-500 hover:bg-teal-600 transition text-white"
      >
        Search
      </button>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-gray-700 text-white z-10 rounded-b shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-3 py-2 hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                setQuery(s);
                handleSearch(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
