import { useState, useEffect } from "react";
import { MapComponent } from "../components/map/MapComponent.tsx";
import { createPost, getPosts } from "../components/data/PostData.tsx";

export const ExploreMap = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts(); // call your function
      setPosts(data);
    }
    fetchPosts();
  }, []);

  const handleAddPost = async (newPost) => {
    // You could have a createPost function too
    const token = localStorage.getItem("token")
    const savedPost = await createPost(newPost, token);
    console.log("savedPost:", savedPost);
    setPosts((prev) => [...prev, savedPost]);
  };

  return <MapComponent posts={posts} onAddPost={handleAddPost} />;
}

