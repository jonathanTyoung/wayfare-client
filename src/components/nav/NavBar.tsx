import { NavLink, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("wayfare_token");

  const handleLogout = () => {
    localStorage.removeItem("wayfare_token");
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side - Brand and navigation links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              Wayfare
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NavLink to="/">Home</NavLink>

              {token && (
                <NavLink to="/profile">Profile</NavLink>
              )}
            </div>
          </div>

          {/* Right side - auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {token ? (
              <button onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};