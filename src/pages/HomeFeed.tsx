import { useEffect, useState } from "react";
import { createPost, deletePost, getPosts } from "../components/data/PostData";
import { getCategories } from "../components/data/CategoryData";
import { PostCard } from "../components/post/Card";
import { PostForm } from "../components/post/Form";
import { useUserContext } from "../context/UserContext";

interface Traveler {
  id: number;
  user: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  short_description: string;
  location?: string;
  traveler?: Traveler;
  tags?: Tag[];
  category?: { id: number; name: string };
  updated_at?: string;
}

// ----- Create Post Modal -----
const CreatePostModal = ({
  isOpen,
  onClose,
  categories,
  loading,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3e2f1c]/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#fafaf9] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#78716c]/20">
        {/* Header */}
        <div className="bg-[#2f3e46] px-8 py-6 border-b border-[#78716c]/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#f9f5eb]">
                Create New Story
              </h2>
              <p className="text-[#fbbf24] mt-1 text-sm">
                Share your travel experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#f9f5eb] hover:text-[#fbbf24] transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-[#fafaf9]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#78716c]/30 border-t-[#14b8a6] rounded-full animate-spin mb-4"></div>
              <p className="text-white text-sm">Loading categories...</p>
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

// ----- HomeFeed Component -----
export const HomeFeed = () => {
  const { currentUser } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading posts...");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const currentUserTravelerId = currentUser?.traveler?.id;

  // ----- Fetch Posts -----
  const loadPosts = async () => {
    try {
      const data = await getPosts();
      if (data) setPosts(data);
    } catch (err: any) {
      setLoadingMessage(`Unable to retrieve posts. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ----- Post Actions -----
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

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) return alert("You must be logged in to share your story.");

    try {
      await createPost(formData, token);
      await loadPosts(); // refresh list
      closeModal();
    } catch (err: any) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
    }
  };

  // ----- Modal -----
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
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5eb]">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border-2 border-[#78716c]/30 border-t-[#14b8a6] rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-[#2f3e46] mb-2">
            Loading stories
          </h2>
          <p className="text-white">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524]">
      {/* Header */}
      <header className="border-b border-[#78716c]/10 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center font-special font-bold tracking-tight text-[#d6d3d1]">
          <h1 className="text-4xl font-bold text-[#d6d3d1] tracking-tight">
            Wayfare
          </h1>
          <p className="text-lg text-white mt-2">
            A Community Travel Journal
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-[#78716c]/10 bg-gray-900 sticky top-20 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-[#d6d3d1] font-semibold text-sm">
              Latest Stories
            </span>
            <span className="text-white hover:text-[#2f3e46] cursor-pointer transition-colors text-sm">
              Following
            </span>
            <span className="text-white hover:text-[#2f3e46] cursor-pointer transition-colors text-sm">
              Your Posts
            </span>
          </div>
          <button
            onClick={openModal}
            className="bg-[#14b8a6] hover:bg-[#f59e0b] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Write
          </button>
        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={closeModal}
        categories={categories}
        loading={loadingCategories}
        onSubmit={handleCreatePost}
      />

      {/* Posts List */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className=" rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <PostCard
                  post={post}
                  initialData={post}
                  isOwner={currentUserTravelerId === post.traveler?.id}
                  removePost={() => handleRemovePost(post.id)}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#fafaf9] border border-[#78716c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white">🗺️</span>
            </div>
            <h2 className="text-3xl font-bold text-[#2f3e46] mb-4">
              Start exploring
            </h2>
            <p className="text-white mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Every great journey starts with a single story. Share your
              adventures and connect with fellow travelers.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-[#14b8a6] hover:bg-[#f59e0b] text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Start your journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
