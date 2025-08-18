import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createPost, deletePost, getPosts } from "../components/data/PostData";
import { getCategories } from "../components/data/CategoryData";
import { PostCard } from "../components/post/Card";
import { PostForm } from "../components/post/Form";
import { useUserContext } from "../context/UserContext";

// ----- Create Post Modal -----
const CreatePostModal = ({ isOpen, onClose, categories, loading, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3e2f1c] bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#333333]">
        <div className="sticky top-0 bg-[#2f3e46] text-white px-8 py-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <span className="text-3xl">✍️</span> Start Your Story
            </h2>
            <p className="text-[#fbbf24] mt-2 text-sm">
              Document your journey for fellow travelers
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#fbbf24] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            ×
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-16 text-[#a8a29e]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6] mx-auto mb-6"></div>
              <p className="text-lg">Preparing your journal...</p>
            </div>
          ) : (
            <PostForm
              categories={categories}
              onSubmit={onSubmit}
              onSuccess={onClose}
              mode="create"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ----- HomeFeed Component with Tag Filtering -----
export const HomeFeed = () => {
  const { currentUser } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading posts...");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const currentUserTravelerId = currentUser?.traveler?.id;

  const [searchParams] = useSearchParams();
  const tagFilter = searchParams.get("tag"); // single tag ID

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      if (data) setPosts(data);
    } catch (err) {
      setLoadingMessage(`Unable to retrieve posts. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRemovePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
      alert("Failed to delete story. Please try again.");
    }
  };

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) return alert("You must be logged in to share your story.");

    try {
      await createPost(formData, token);
      await loadPosts(); // refresh list
      closeModal();
    } catch (err) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
    }
  };

  const openModal = async () => {
    setLoadingCategories(true);
    setShowModal(true);
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setCategories([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif bg-[#121212]">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#14b8a6] mx-auto"></div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🗺️</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#f5f5f4] mb-2">Loading Your Journey</h2>
          <p className="text-[#a8a29e]">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Apply tag filtering
  const filteredPosts = tagFilter
    ? posts.filter((post) => post.tags?.some((tag) => tag.id === Number(tagFilter)))
    : posts;

  return (
    <div className="min-h-screen bg-[#121212] font-serif">
      {/* Masthead */}
      <div className="text-white max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Wayfare</h1>
        <p className="text-xl text-[#fbbf24] mt-2 font-light">
          A Community Travel Journal
        </p>
      </div>

      {/* Navigation */}
      <div className="border-b border-[#333333] bg-[#121212] sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-[#f5f5f4] font-semibold">Latest Stories</span>
            <span className="text-[#a8a29e] hover:text-[#f5f5f4] cursor-pointer transition-colors">
              Following
            </span>
            <span className="text-[#a8a29e] hover:text-[#f5f5f4] cursor-pointer transition-colors">
              Your Posts
            </span>
          </div>
          <button
            onClick={openModal}
            className="bg-[#14b8a6] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0f9488] transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <span className="text-lg">✍️</span> Write
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={closeModal}
        categories={categories}
        loading={loadingCategories}
        onSubmit={handleCreatePost}
      />

      {/* Posts List */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              initialData={post}
              isOwner={currentUserTravelerId === post.traveler?.id}
              removePost={() => handleRemovePost(post.id)}
            />
          ))
        ) : (
          <div className="text-center py-20 text-[#a8a29e]">
            <h3 className="text-4xl font-bold mb-4 text-[#f5f5f4]">
              Your Map Awaits
            </h3>
            <p className="text-xl mb-6">
              Every great journey starts with a single story. Share your adventures and connect with fellow travelers.
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-[#14b8a6] to-[#f59e0b] text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <span className="text-2xl">🗺️</span> Start Your Journey{" "}
              <span className="text-xl">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
