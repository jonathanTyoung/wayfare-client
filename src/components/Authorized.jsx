import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/NavBar";
import { Sidebar } from "./nav/SideBar";

export const Authorized = () => {
  if (localStorage.getItem("wayfare_token")) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-white">
        {/* Navbar scrolls away */}
        <NavBar />

        {/* Main content with sidebar and main area */}
        <div className="flex flex-1">
          {/* Sidebar scrolls away */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
  return <Navigate to="/login" replace />;
};

