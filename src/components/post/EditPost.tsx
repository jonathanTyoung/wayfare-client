import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../data/PostData.tsx";
import { PostForm } from "./Form.tsx";
import { getCategories } from "../data/CategoryData.ts";

export const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch post and categories concurrently
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postData, categoryData] = await Promise.all([
          getPostById(postId),
          getCategories(),
        ]);
        setPost(postData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch post or categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  // Navigate back helper
  const handleBack = () => navigate("/home");

  // Handles submission of edited post
  const handleUpdatePost = async (updatedData) => {
    const token = localStorage.getItem("wayfare_token");

    try {
      // PATCH the post and return the updated object
      const updatedPost = await updatePost(postId, updatedData, token);
      console.log("Post updated successfully:", updatedPost);

      // Return the updated post so PostForm can use its id for photo upload
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error; // allow PostForm to handle the error
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PostForm
        categories={categories}
        initialData={post}
        onSubmit={handleUpdatePost}
        onSuccess={() => console.log("Post updated!")}
        mode="edit"
        onReset={handleBack}
      />
    </div>
  );
};
