import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../components/data/PostData";
import { PostForm } from "../components/post/Form.tsx";
import { getCategories } from "../components/data/CategoryData.ts";

export const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false)
  const navigate = useNavigate();

  const handleBack = () => navigate("/home");

  useEffect(() => {
    async function fetchPost() {
      const data = await getPostById(postId);
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [postId]);

  useEffect(() => {
    setLoadingCategories(true);
    getCategories()
      .then((data) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (!postId) return;
    setLoadingPost(true);
    getPostById(postId)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoadingPost(false));
  }, [postId]);

  const handleUpdatePost = async (updatedData) => {
    console.log("Updating post with data:", updatedData); // <-- here
    const token = localStorage.getItem("wayfare_token");
    try {
        const updatedPost = await updatePost(postId, updatedData, token);
        console.log("Post updated successfully:", updatedPost);
        // additional logic on success
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post. " + error.message);
    }
    };


  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <PostForm
      categories={categories}
      initialData={post}
      onSubmit={handleUpdatePost}
      onSuccess={() => console.log("Updated!")}
      mode="edit"
      onReset={handleBack}
    />
  );
};

export default EditPost;
