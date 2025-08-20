import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiPlus } from "react-icons/fi";

import Logo from "../assets/park-jon.svg"; // adjust path to your .svg
import { PostForm } from "../post/Form.tsx";
import { useUserContext } from "../../context/UserContext.tsx";
import { getCategories } from "../data/CategoryData.ts";
import { createPost } from "../data/PostData.tsx";

interface SidebarProps {
  openSearch: () => void;
}

// ----- Create Post Modal Component -----
const CreatePostModal = ({
  isOpen,
  onClose,
  categories,
  loading,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#292524] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-stone-600">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-4 border-b border-stone-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                Write your story
              </h2>
              <p className="text-stone-400 mt-0.5 text-sm">
                Share your travel experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] bg-[#292524]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-stone-600 border-t-stone-100 animate-spin mb-3"></div>
              <p className="text-stone-400 text-sm">Loading categories...</p>
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

export const Sidebar: React.FC<SidebarProps> = ({ openSearch }) => {
  const { currentUser } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ----- Modal Handlers -----
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

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) return alert("You must be logged in to share your story.");

    try {
      await createPost(formData, token);
      closeModal();
      // Note: You might want to emit an event or use a global state manager
      // to refresh posts in HomeFeed after creating from sidebar
    } catch (err: any) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
    }
  };

  return (
    <>
      <aside className="w-20 bg-[#292524] border-r border-[#78716c]/10 flex flex-col p-4 sticky top-0 h-screen overflow-y-auto">
        {/* Logo at the very top */}
        <Link to="/home" className="mb-6 flex justify-center" title="Home">
          <img
            src="src/assets/park-jon.svg"
            alt="Wayfare Logo"
            className="w-10 h-10 hover:opacity-80 transition-opacity"
          />
        </Link>

        <nav className="flex flex-col gap-2 items-center justify-center h-full">
          <Link
            to="/home"
            title="Home"
            className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
          >
            🏠
          </Link>
          <Link
            to="/profile"
            title="Profile"
            className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
          >
            👤
          </Link>
          <Link
            to="/explore"
            title="Explore Map"
            className="block p-3 rounded-md hover:bg-[#78716c]/10 transition-colors flex justify-center text-[#78716c] hover:text-[#2f3e46]"
          >
            🗺️
          </Link>

          <button
            onClick={openModal}
            title="Create Post"
            className="p-3 rounded-md hover:bg-[#78716c]/10 transition-colors text-[#78716c] hover:text-[#2f3e46]"
          >
            <FiPlus className="text-xl" />
          </button>

          <button
            onClick={openSearch}
            title="Search"
            className="p-3 rounded-md hover:bg-[#78716c]/10 transition-colors text-[#78716c] hover:text-[#2f3e46]"
          >
            <FiSearch className="text-xl" />
          </button>
        </nav>
      </aside>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={closeModal}
        categories={categories}
        loading={loadingCategories}
        onSubmit={handleCreatePost}
      />
    </>
  );
};
