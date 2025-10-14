import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "../pages/Layout";
import { UserProvider } from "../context/UserContext";
import { useState } from "react";

export const Authorized = () => {
  const token = localStorage.getItem("wayfare_token");
  const [searchResults, setSearchResults] = useState([]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <UserProvider>
      <Layout searchResults={searchResults} setSearchResults={setSearchResults}>
        <div className="flex-1 flex flex-col min-h-screen">
          <Outlet context={{ searchResults, setSearchResults }} />
        </div>
      </Layout>
    </UserProvider>
  );
};
