import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./Authorized.jsx";
import { Login } from "./auth/Login.jsx";
import { Register } from "./auth/Register.jsx";
import App from "../App.jsx";
import LandingPage from "./auth/LandingPage.js";
import { HomeFeed } from "../pages/HomeFeed.js";
import { EditPost } from "./post/EditPost.js";
import {Profile} from "../pages/Profile.js";
import { ExploreMap } from "../pages/ExploreMap.js";
import { SearchResults } from "./search/SearchResults.js";
import { PostDetails } from "./post/PostDetails.js";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Authorized />}>
          <Route path="/home" element={<HomeFeed />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="/posts/:postId/edit" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<ExploreMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ApplicationViews;
