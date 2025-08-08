import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/NavBar";

export const Authorized = () => {
  if (localStorage.getItem("wayfare_token")) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* NavBar on top */}
        <NavBar />

        {/* Main content below */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    );
  }
  return <Navigate to="/login" replace />;
};
