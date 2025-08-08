import { NavLink, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("wayfare_token");

  const handleLogout = () => {
    localStorage.removeItem("wayfare_token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - links */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold hover:underline ${
                isActive ? "underline decoration-fuchsia-500" : ""
              }`
            }
          >
            Home
          </NavLink>

          {token && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-semibold hover:underline ${
                  isActive ? "underline decoration-fuchsia-500" : ""
                }`
              }
            >
              Profile
            </NavLink>
          )}
        </div>

        {/* Right side - auth buttons */}
        <div className="flex space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-semibold hover:underline ${
                    isActive ? "underline decoration-fuchsia-500" : ""
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-sm font-semibold hover:underline ${
                    isActive ? "underline decoration-fuchsia-500" : ""
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
