import React from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import Logo from "../assets/logo.svg"; // adjust path to your .svg

interface SidebarProps {
  openSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ openSearch }) => (
  <aside className="w-20 bg-[#292524] border-r border-[#78716c]/10 flex flex-col p-4 sticky top-0 h-screen overflow-y-auto">
    {/* Logo at the very top */}
    <Link to="/home" className="mb-6 flex justify-center" title="Home">
      <img
        src="src/assets/park-jon.svg"
        alt="Wayfare Logo"
        className="w-10 h-10 hover:opacity-80 transition-opacity"
      />
    </Link>

    <nav className="flex flex-col gap-2 items-center justify-center h-full">
      <Link
        to="/home"
        title="Home"
        className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
      >
        🏠
      </Link>
      <Link
        to="/profile"
        title="Profile"
        className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
      >
        👤
      </Link>
      <Link
        to="/explore"
        title="Explore Map"
        className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
      >
        🗺️
      </Link>

      <button
        onClick={openSearch}
        title="Search"
        className="p-3 rounded-md hover:bg-[#78716c]/10 transition-colors text-[#78716c] hover:text-[#2f3e46]"
      >
        <FiSearch className="text-xl" />
      </button>
    </nav>
  </aside>
);
