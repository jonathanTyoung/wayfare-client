// NavBar.tsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { SearchBar } from "../search/SearchBar";

interface NavBarProps {
  openSearch: () => void; // from Layout
  isSearchOpen: boolean;
  closeSearch: () => void;
}

export const NavBar = ({
  openSearch,
  isSearchOpen,
  closeSearch,
}: NavBarProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("wayfare_token");

  const handleLogout = () => {
    localStorage.removeItem("wayfare_token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#292524] text-white p-4 flex flex-col gap-2 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* <div
            className="font-bold text-xl cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Wayfare
          </div> */}
          {/* {token && (
            <div className="flex items-center gap-2">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </div>
          )} */}
        </div>

        <div className="flex items-center gap-2">
          {token && (
            <button onClick={openSearch} title="Search">
              <Search className="w-6 h-6 text-white" />
            </button>
          )}
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>

      {/* Inline SearchBar inside NavBar */}
      {isSearchOpen && (
        <div className="mt-2 relative max-w-md">
          <SearchBar onClose={closeSearch} />
        </div>
      )}
    </nav>
  );
};