import React, { useState } from "react";
import { Sidebar } from "../components/nav/SideBar";
import { NavBar } from "../components/nav/NavBar";
import { SearchBar } from "../components/search/SearchBar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar openSearch={openSearch} />

      <div className="flex-1 flex flex-col">
        {/* NavBar now fully manages the inline SearchBar */}
        <NavBar
          openSearch={openSearch}
          isSearchOpen={isSearchOpen}
          closeSearch={closeSearch}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
