import { useContext, useEffect, useState } from "react";
import { createPost, deletePost, getPosts } from "../components/data/PostData";
import { PostCard } from "../components/post/Card";
import { PostForm } from "../components/post/Form";
import { getCategories } from "../components/data/CategoryData";
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

export const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading posts...");

  const currentUserTravelerId = currentUser?.traveler?.id;

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

  useEffect(() => {
    getPosts()
      .then((data: Post[] | null) => {
        if (data) setPosts(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setLoadingMessage(`Unable to retrieve posts. ${err.message}`);
      });
  }, []);

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

  const handleRemovePost = async (id: number) => {
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

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) {
      alert("You must be logged in to share your story.");
      return;
    }

    try {
      console.log("Creating post with data:", formData);
      await createPost(formData, token);
      const freshPosts = await getPosts();
      if (freshPosts) setPosts(freshPosts);
      closeModal();
    } catch (err) {
      console.error("Failed to create post", err);
      alert(err.message || "Failed to create story.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] font-serif">
      {/* Masthead - Substack style */}
      <div className="text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl"></span>
              <h1 className="text-5xl font-bold tracking-tight">Wayfare</h1>
              <span className="text-5xl"></span>
            </div>
            <p className="text-xl text-[#fbbf24] mb-2 font-light">
              A Community Travel Journal
            </p>
            <p className="text-lg text-white opacity-80 max-w-2xl mx-auto leading-relaxed">
              Where wanderers share stories, locals offer insights, and every journey becomes part of our collective map
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b border-[#333333] bg-[#121212] sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-[#f5f5f4] font-semibold">Latest Stories</span>
              <span className="text-[#a8a29e] hover:text-[#f5f5f4] cursor-pointer transition-colors">Destinations</span>
              <span className="text-[#a8a29e] hover:text-[#f5f5f4] cursor-pointer transition-colors">Travelers</span>
            </div>
            
            {/* Write Button - Substack style */}
            <button
              onClick={openModal}
              className="bg-[#14b8a6] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0f9488] transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span className="text-lg">✍️</span>
              Write
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showModal}
          onClose={closeModal}
          categories={categories}
          loadingCategories={loadingCategories}
          onSubmit={handleCreatePost}
        />

        {/* Featured/Intro Section */}
        {posts.length > 0 && (
          <div className="mb-12 text-center">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-[#f5f5f4] mb-3">
                Recent Posts
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#14b8a6] to-[#fbbf24] mx-auto rounded-full"></div>
            </div>
            {/* <p className="text-[#a8a29e] mt-4 text-lg font-light max-w-2xl mx-auto">
              Stories from travelers around the globe, shared experiences, and hidden gems waiting to be discovered
            </p> */}
          </div>
        )}

        {/* Posts List - Substack single column style */}
        <main className="space-y-8">
          {posts.map((post) => (
            <PostCard
              initialData={post}
              key={post.id}
              post={post}
              isOwner={currentUserTravelerId === post.traveler?.id}
              removePost={handleRemovePost}
            />
          ))}
        </main>

        {/* Empty State - Travel themed */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-lg mx-auto">
              <div className="mb-12 text-8xl opacity-20">
                🌍
              </div>
              <h3 className="text-4xl font-bold mb-6 text-[#f5f5f4]">
                Your Map Awaits
              </h3>
              <p className="text-xl text-[#a8a29e] mb-12 leading-relaxed font-light">
                Every great journey starts with a single story. Share your adventures, 
                discover new destinations, and connect with fellow travelers.
              </p>
              <div className="space-y-4">
                <button
                  onClick={openModal}
                  className="bg-gradient-to-r from-[#14b8a6] to-[#f59e0b] text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <span className="text-2xl">🗺️</span>
                  Start Your Journey
                  <span className="text-xl">→</span>
                </button>
                <p className="text-sm text-[#a8a29e] opacity-75">
                  Join thousands of travelers sharing their stories
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-[#333333] bg-[#121212] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-8 text-sm text-[#a8a29e]">
            <span className="hover:text-[#f5f5f4] cursor-pointer transition-colors">About</span>
            <span className="hover:text-[#f5f5f4] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#f5f5f4] cursor-pointer transition-colors">Terms</span>
            <span className="text-[#14b8a6]">Made for travelers, by travelers</span>
          </div>
        </div>
      </div>
    </div>
  );
};