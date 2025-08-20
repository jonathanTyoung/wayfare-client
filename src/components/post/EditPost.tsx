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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-600 border-t-stone-100 animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-stone-100 mb-2">
            Loading post
          </h2>
          <p className="text-stone-400">Preparing your story for editing...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-stone-800 border border-stone-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-stone-400">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mb-3">
            Story not found
          </h2>
          <p className="text-stone-400 mb-6 leading-relaxed">
            The story you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={handleBack}
            className="bg-stone-100 hover:bg-stone-200 text-[#292524] px-6 py-2.5 font-medium transition-colors border border-stone-100"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524]">
      {/* Header */}
      <header className="border-b border-stone-600/20 bg-[#292524] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                Edit Story
              </h1>
              <p className="text-stone-400 mt-1">
                Update your travel experience
              </p>
            </div>
            <button
              onClick={handleBack}
              className="text-stone-400 hover:text-stone-100 transition-colors text-sm font-medium"
            >
              ← Back to Stories
            </button>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-stone-800/30 border border-stone-600/20 p-8">
          <PostForm
            categories={categories}
            initialData={post}
            onSubmit={handleUpdatePost}
            onSuccess={() => console.log("Post updated!")}
            mode="edit"
            onReset={handleBack}
          />
        </div>
      </div>
    </div>
  );
};
