import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/NavBar";
import { Sidebar } from "./nav/Sidebar";
import { UserProvider } from "../context/UserContext";



export const Authorized = () => {
  if (localStorage.getItem("wayfare_token")) {
    return (
      <UserProvider>
        <div className="flex flex-col min-h-screen bg-bg text-white">
          <NavBar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </UserProvider>
    );
  }
  return <Navigate to="/login" replace />;
};
