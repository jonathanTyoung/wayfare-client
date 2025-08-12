import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "./auth/Login.jsx"
import { Register } from './auth/Register.jsx'
import App from "../App.jsx"
import LandingPage from "./auth/LandingPage"
import { HomeFeed } from "../pages/HomeFeed"
import { EditPost } from "../pages/EditPost.tsx"


const ApplicationViews = () => {

    return <BrowserRouter>
        <Routes>
            <Route path="/wayfare" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Authorized />}>
                <Route path="/home" element={<HomeFeed />} />
                <Route path="/posts/:postId/edit" element={<EditPost />} />
            </Route>
        </Routes>
    </BrowserRouter>
    
}

export default ApplicationViews
