import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { SearchBar } from "../search/SearchBar";
import logo from "../../assets/park-jon.svg";

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
    <nav className="bg-app-bg text-white sticky top-0 z-50 border-b border-stone-700/40">
      <div className="h-14 px-6 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3" title="Home">
          <img src={logo} alt="Wayfare" className="h-8 w-8" />
          <span className="font-special text-xl tracking-tight text-app-accent">
            Wayfare
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {token && (
            <button
              onClick={openSearch}
              title="Search"
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-stone-200 hover:text-app-accent hover:bg-stone-800/60 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          {token ? (
            <button
              onClick={handleLogout}
              className="h-9 px-4 text-sm font-medium rounded-lg text-stone-200 hover:text-app-accent hover:bg-stone-800/60 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `h-9 px-4 inline-flex items-center text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-app-accent underline underline-offset-4"
                      : "text-stone-200 hover:text-app-accent"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `h-9 px-4 inline-flex items-center text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-app-accent underline underline-offset-4"
                      : "bg-teal text-stone-900 hover:bg-teal-hover"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Inline SearchBar inside NavBar */}
      {isSearchOpen && (
        <div className="px-6 pb-3 relative max-w-md">
          <SearchBar onClose={closeSearch} />
        </div>
      )}
    </nav>
  );
};