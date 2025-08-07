import { NavLink, useNavigate } from "react-router-dom"
import "./Sidebar.css"

export const SideBar = () => {
    const navigate = useNavigate()
    return (
        <nav className="sidebar">
            <ul>
                {
                    (localStorage.getItem("wayfare-client_token") !== null) ?
                    <>
                        <li className="sidebar__item">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("wayfare-client_token")
                                    navigate('/login')
                                }}
                            >Logout</button>
                        </li>
                    </> :
                    <>
                        <li className="sidebar__item">
                            <NavLink to={"/login"}>Login</NavLink>
                        </li>
                        <li className="sidebar__item">
                            <NavLink to={"/register"}>Register</NavLink>
                        </li>
                    </>
                }
            </ul>
        </nav>
    )
}