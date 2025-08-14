import React from "react";
import { Link } from "react-router-dom";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 bg-bg border-r border-border text-text flex flex-col p-4 sticky top-0 h-screen overflow-y-auto">
      <nav className="flex flex-col gap-4 items-center">
        <Link
          to="/home"
          className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center"
          title="Home"
        >
          🏠
        </Link>

        <Link
          to="/profile"
          className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center"
          title="Profile"
        >
          👤
        </Link>

        <Link
          to="/explore"
          className="block p-3 rounded hover:bg-accent hover:text-bg transition flex justify-center"
          title="Explore Map"
        >
          🗺️
        </Link>

        {/* Add more icon links here */}
      </nav>
    </aside>
  );
};
