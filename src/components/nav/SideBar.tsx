import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-bg border-r border-border text-text flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
      <nav className="flex flex-col gap-4">
        <a
          href="/home"
          className="block px-3 py-2 rounded hover:bg-accent hover:text-bg transition"
        >
          Home
        </a>
        <a
          href="/profile"
          className="block px-3 py-2 rounded hover:bg-accent hover:text-bg transition"
        >
          Profile
        </a>
        <a
          href="/explore"
          className="block px-3 py-2 rounded hover:bg-accent hover:text-bg transition"
        >
          Explore Map
        </a>
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
};
