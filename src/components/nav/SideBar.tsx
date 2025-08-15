import React from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

interface SidebarProps {
  openSearch: () => void; // passed from Layout
}

export const Sidebar: React.FC<SidebarProps> = ({ openSearch }) => {
  return (
    <aside className="w-20 bg-bg border-r border-border text-text flex flex-col p-4 sticky top-0 h-screen overflow-y-auto">
      <nav className="flex flex-col gap-4 items-center flex-1">
        <Link to="/home" title="Home" className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center">🏠</Link>
        <Link to="/profile" title="Profile" className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center">👤</Link>
        <Link to="/explore" title="Explore Map" className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center">🗺️</Link>
        <div className="flex-1"></div>

        <button onClick={openSearch} title="Search">
          <FiSearch className="text-xl" />
        </button>
      </nav>
    </aside>
  );
};
