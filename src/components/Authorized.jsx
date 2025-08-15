import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "../pages/Layout";
import { UserProvider } from "../context/UserContext";
import { useState } from "react";

export const Authorized = () => {
  const token = localStorage.getItem("wayfare_token");
  const [searchResults, setSearchResults] = useState([]); // <-- state for search

  if (!token) return <Navigate to="/login" replace />;

  return (
    <UserProvider>
      <Layout searchResults={searchResults} setSearchResults={setSearchResults}>
        <Outlet context={{ searchResults, setSearchResults }} />{" "} {/* <-- pass context */}
      </Layout>
    </UserProvider>
  );
};
