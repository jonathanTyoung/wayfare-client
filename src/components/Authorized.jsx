import { Navigate, Outlet } from "react-router-dom"
import { SideBar } from "./nav/SideBar.jsx"

export const Authorized = () => {
  if (localStorage.getItem("wayfare-client_token")) {
    return <>
      <SideBar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  }
  return <Navigate to="/login" replace />
}
