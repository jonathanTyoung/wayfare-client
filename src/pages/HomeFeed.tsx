import { useEffect, useState } from "react";
import { createPost, deletePost, getPosts } from "../components/data/PostData";
import { getCategories } from "../components/data/CategoryData";
import { PostForm } from "../components/post/Form";
import { useUserContext } from "../context/UserContext";
import { PostCard } from "../components/post/Card.tsx";

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
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
              // travelerId={currentUserTravelerId} // <-- pass the traveler ID here
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
      console.error(err);
      alert("Failed to delete story. Please try again.");
    }
  };

  const handleToggleLike = (
    postId: number,
    liked: boolean,
    likesCount: number
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked_by_user: liked, likes_count: likesCount }
          : post
      )
    );
  };

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

  const updatePostLikes = (
    postId: number,
    liked: boolean,
    likesCount: number
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        // Update `likes` array to reflect new state
        let updatedLikes = post.likes ? [...post.likes] : [];
        if (liked) {
          // Add current user if not already there
          if (
            !updatedLikes.some(
              (like) => like.traveler === currentUserTravelerId
            )
          ) {
            updatedLikes.push({ traveler: currentUserTravelerId });
          }
        } else {
          // Remove current user
          updatedLikes = updatedLikes.filter(
            (like) => like.traveler !== currentUserTravelerId
          );
        }

        return {
          ...post,
          likes: updatedLikes,
        };
      })
    );
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
      <div className="min-h-screen flex items-center justify-center bg-[#292524]">
        <div className="text-center max-w-md">
          <div className="w-8 h-8 border-2 border-stone-600 border-t-stone-100 animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-stone-100 mb-2">
            Loading posts
          </h2>
          <p className="text-stone-400">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524]">
      {/* Proper Homepage Header */}
      <header className="border-b border-stone-600/20 bg-[#292524] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-special font-bold text-stone-100 tracking-tight mb-2">
            Wayfare
          </h1>
          <p className="text-lg text-stone-300 mb-6">
            A Community Travel Journal
          </p>
          <button
            onClick={openModal}
            className="bg-stone-100 hover:bg-stone-200 text-[#292524] px-6 py-2.5 font-medium transition-colors border border-stone-100"
          >
            Share Your Story
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-stone-600/20 bg-[#292524] sticky top-[136px] z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-8 text-sm">
            <span className="text-stone-100 font-medium border-b-2 border-stone-100 pb-2">
              Latest Posts
            </span>
            <span className="text-stone-400 hover:text-stone-100 cursor-pointer transition-colors">
              Following
            </span>
            <span className="text-stone-400 hover:text-stone-100 cursor-pointer transition-colors">
              Your Posts
            </span>
          </div>
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

      {/* Posts List - Tighter Spacing */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`
                  border-b border-stone-600/20 pb-6 mb-6
                  ${index === posts.length - 1 ? "border-b-0 pb-0 mb-0" : ""}
                `}
              >
                <PostCard
                  post={post}
                  initialData={post}
                  currentUserId={currentUserTravelerId}
                  updatePostLikes={updatePostLikes} // ✅ same name used in PostCard
                  isOwner={currentUserTravelerId === post.traveler?.id}
                  removePost={() => handleRemovePost(post.id)}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-t border-stone-600/20 mt-8">
            <div className="w-12 h-12 bg-stone-800 border border-stone-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl text-stone-300">🗺️</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 mb-3">
              Start exploring
            </h2>
            <p className="text-stone-400 mb-6 max-w-md mx-auto leading-relaxed">
              Every great journey starts with a single story. Share your
              adventures and connect with fellow travelers.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-[#292524] px-5 py-2.5 font-medium transition-colors border border-stone-100"
            >
              Start your journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
