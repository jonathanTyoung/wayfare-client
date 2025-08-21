// Updated Profile with Sidebar-style CreatePostModal (TypeScript-safe)
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

// ---- Types ----
interface Traveler {
  id: number;
  name?: string;
  location?: string;
  bio?: string;
}

interface User {
  id: number;
  name: string;
  avatarUrl?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  traveler?: Traveler;
  liked_by_user: boolean;
  likes_count: number;
  // any other fields PostCard expects
}

interface UserProfile {
  user: User;
  traveler?: Traveler;
}

interface Category {
  id: number;
  name: string;
}

// ----- Dark-styled CreatePostModal (Sidebar style) -----
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  loading: boolean;
  onSubmit: (formData: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
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

// ---- Profile Component ----
export const Profile: React.FC = () => {
  const { currentUser } = useUserContext();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err?.message || "Unable to load profile");
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  // Fetch posts
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

  // Modal handlers
  const openModal = async () => {
    setLoadingCategories(true);
    setShowModal(true);
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCategories([]);
  };

  // Create post
  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) return alert("You must be logged in to share your story.");

    try {
      const createdPost = await createPost(formData, token);
      console.log("Post creation response:", createdPost);

      if (!createdPost?.id) {
        throw new Error("Post creation failed: missing post ID.");
      }

      // Update local state if you want
      setPosts((prev) => [createdPost, ...prev]);

      // Close modal
      closeModal();

      // ✅ RETURN the post so PostForm gets it
      return createdPost;
    } catch (err: any) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
      throw err; // re-throw so PostForm can catch
    }
  };

  // Remove post
  const handleRemovePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
      alert("Failed to delete story. Please try again.");
    }
  };

  // --- Render ---
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#78716c]/30 border-t-[#14b8a6] rounded-full animate-spin mb-4"></div>
          <p className="text-[#d6d3d1]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <p className="text-[#d6d3d1]">No profile found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6 flex-1">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {userProfile.user?.avatarUrl ? (
                  <img
                    src={userProfile.user.avatarUrl}
                    alt={`${userProfile.user.name}'s avatar`}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-[#14b8a6] shadow-lg hover:ring-[#fbbf24] transition-all duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-[#14b8a6]/20 hover:ring-[#fbbf24]/40 hover:scale-105 transition-all duration-300 text-2xl">
                    {userProfile.user?.name
                      ? userProfile.user.name.trim().charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#fafaf9] mb-3">
                  {userProfile.user?.name}
                </h1>
                {userProfile.traveler?.location && (
                  <p className="text-[#d6d3d1] mb-3 flex items-center gap-2">
                    <span className="text-[#fbbf24]">📍</span>
                    {userProfile.traveler.location}
                  </p>
                )}
                {userProfile.traveler?.bio && (
                  <p className="text-[#d6d3d1] leading-relaxed mb-4 max-w-2xl">
                    {userProfile.traveler.bio}
                  </p>
                )}
                <div className="flex items-center gap-8 text-sm">
                  <div className="text-[#d6d3d1]">
                    <span className="font-bold text-[#fbbf24]">
                      {posts.length}
                    </span>{" "}
                    posts
                  </div>
                  <div className="text-[#d6d3d1]">
                    <span className="font-bold text-[#14b8a6]">0</span>{" "}
                    following
                  </div>
                  <div className="text-[#d6d3d1]">
                    <span className="font-bold text-[#14b8a6]">0</span>{" "}
                    followers
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/edit-profile"
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-[#fafaf9] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600"
              >
                Edit profile
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700"></div>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showModal}
          onClose={closeModal}
          categories={categories}
          loading={loadingCategories}
          onSubmit={handleCreatePost}
        />

        {/* Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#fafaf9] mb-1">Posts</h2>
              <p className="text-[#d6d3d1]">
                {posts.length === 0
                  ? "No posts shared yet"
                  : `${posts.length} ${
                      posts.length === 1 ? "story" : "posts"
                    } published`}
              </p>
            </div>
          </div>

          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#78716c]/30 border-t-[#14b8a6] rounded-full animate-spin mb-4"></div>
              <p className="text-[#d6d3d1]">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-[#d6d3d1]">✏️</span>
              </div>
              <h3 className="text-xl font-bold text-[#fafaf9] mb-3">
                Share your first story
              </h3>
              <p className="text-[#d6d3d1] mb-8 max-w-md mx-auto">
                Tell the world about your travel experiences and connect with
                fellow adventurers.
              </p>
              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-[#05b88b] hover:bg-[#fbbf24] text-[#1E1E1E] px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Write your first story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-200"
                >
                  <PostCard
                    post={post}
                    initialData={post}
                    isOwner={currentUser.traveler?.id === post.traveler?.id}
                    currentUserId={currentUser?.id}
                    removePost={handleRemovePost}
                    updatePostLikes={(postId, liked, likesCount) => {
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === postId
                            ? {
                                ...p,
                                liked_by_user: liked,
                                likes_count: likesCount,
                              }
                            : p
                        )
                      );
                    }}
                    renderEditButton={(postId) => (
                      <Link
                        to={`/edit/${postId}`}
                        state={{
                          from: "profile",
                          userId: post.traveler?.id ?? null,
                        }}
                        className="text-[#14b8a6] hover:text-[#fbbf24] text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
