import { useState, useEffect } from "react";
import { getUserProfile } from "../components/data/UserData";
import {
  getPostsByTraveler,
  createPost,
  deletePost,
} from "../components/data/PostData";
import { PostCard } from "../components/post/Card";
import { PostForm } from "../components/post/Form";
import { getCategories } from "../components/data/CategoryData";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { ProfileCard } from "../components/profile/Card";

// Enhanced Modal Component with travel theme
const CreatePostModal = ({
  isOpen,
  onClose,
  categories,
  loadingCategories,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3e2f1c] bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#333333]">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#2f3e46] text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <span className="text-3xl">✍️</span>
                Start Your Story
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
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {loadingCategories ? (
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

export default function Profile() {
  const { currentUser } = useUserContext();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err?.message || "Unable to load profile");
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchTravelerPosts() {
      if (!currentUser?.traveler?.id) return;

      try {
        const travelerPosts = await getPostsByTraveler(currentUser.traveler.id);
        setPosts(travelerPosts);
      } catch (err) {
        console.error("Error fetching traveler posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchTravelerPosts();
  }, [currentUser]);

  const openModal = async () => {
    setLoadingCategories(true);
    setShowModal(true);
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
    setLoadingCategories(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setCategories([]);
  };

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) {
      alert("You must be logged in to share your story.");
      return;
    }

    try {
      console.log("Creating post with data:", formData);
      await createPost(formData, token);
      // Refresh the user's posts after creating a new one
      const travelerPosts = await getPostsByTraveler(currentUser.traveler.id);
      setPosts(travelerPosts);
      closeModal();
    } catch (err) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
    }
  };

  const handleRemovePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );
    if (!confirmDelete) return;

    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete story. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] font-serif">
      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Information */}
        <ProfileCard
          userProfile={userProfile}
          loading={loadingProfile}
          error={error}
          variant="default"
        />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showModal}
          onClose={closeModal}
          categories={categories}
          loadingCategories={loadingCategories}
          onSubmit={handleCreatePost}
        />

        {/* User Posts Section */}
        <section className="bg-[#121212] border border-[#333333] text-[#f5f5f4] rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-semibold text-[#f5f5f4]">
              My Travel Stories
            </h2>
          </div>

          {loadingPosts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6] mx-auto mb-4"></div>
              <p className="text-[#a8a29e]">Loading your adventures...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-8 text-6xl opacity-20">✏️</div>
              <h3 className="text-2xl font-bold mb-4 text-[#f5f5f4]">
                Your Journey Starts Here
              </h3>
              <p className="text-[#a8a29e] mb-8 text-lg font-light max-w-md mx-auto">
                Share your first travel story and inspire fellow wanderers with
                your adventures.
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#14b8a6] to-[#f59e0b] text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-xl">🗺️</span>
                Create Your First Story
                <span className="text-lg">→</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[#a8a29e] font-light">
                  {posts.length} {posts.length === 1 ? "story" : "stories"}{" "}
                  shared
                </p>
                <button
                  onClick={openModal}
                  className="bg-[#14b8a6] text-white px-4 py-2 rounded-full font-medium hover:bg-[#0f9488] transition-colors flex items-center gap-2"
                >
                  <span className="text-sm">✍️</span>
                  Write
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    initialData={post}
                    isOwner={currentUser.traveler?.id === post.traveler?.id}
                    removePost={handleRemovePost}
                    renderEditButton={(postId) => (
                      <Link
                        to={`/edit/${postId}`}
                        state={{
                          from: "profile",
                          userId: currentUser.traveler?.id,
                        }}
                        className="text-[#14b8a6] hover:text-[#0f9488] font-medium transition-colors flex items-center gap-1"
                      >
                        <span className="text-sm">✏️</span>
                        Edit
                      </Link>
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
