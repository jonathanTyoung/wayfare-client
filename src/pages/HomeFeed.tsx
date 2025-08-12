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

export const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading posts...");

  const currentUserTravelerId = currentUser?.traveler?.id;
  const toggleForm = async () => {
    if (!showForm) {
      setLoadingCategories(true);
      try {
        const data = await getCategories();
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
      setLoadingCategories(false);
    }
    setShowForm((prev) => !prev);
  };

  useEffect(() => {
    getPosts()
      .then((data: Post[] | null) => {
        if (data) {
          setPosts(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        setLoadingMessage(
          `Unable to retrieve posts. Status code ${err.message} on response.`
        );
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="mb-8 text-lg">Loading...</div>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // logic for actually removing post from UI and the DB
  const handleRemovePost = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleCreatePost = async (formData) => {
    const token = localStorage.getItem("wayfare_token");
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      await createPost(formData, token);
      const freshPosts = await getPosts(); //fetches fresh posts list
      if (freshPosts) {
        setPosts(freshPosts);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    // inside JSX
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 bg-bg text-text">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-primary">Home Feed</h1>
        <p className="text-lg max-w-xl mx-auto text-secondary">
          Welcome to your personalized feed — discover, connect, and share
        </p>
      </header>

      {/* Toggle Button */}
      <button
        onClick={toggleForm}
        className="bg-primary text-bg px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
      >
        {showForm ? (
          <>
            <span>✕</span> Cancel
          </>
        ) : (
          <>
            <span>➕</span> Create a Post
          </>
        )}
      </button>

      {/* Post Creation Form */}
      {showForm && (
        <div className="p-8 mb-8 border border-border rounded-lg bg-bg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-primary">
              🎯 Create New Post
            </h2>
            <p className="text-secondary">Document a new experience</p>
          </div>

          {loadingCategories ? (
            <div className="text-center py-8 text-secondary">
              <div className="mb-4">Loading...</div>
              <p>Loading categories...</p>
            </div>
          ) : (
            <PostForm
              categories={categories}
              onSubmit={handleCreatePost}
              onSuccess={() => setShowForm(false)}
              mode="create"
            />
          )}
        </div>
      )}

      {/* Posts Grid */}
      <main>
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => {
            console.log("currentUser:", currentUser);
            console.log("currentUserTravelerId:", currentUserTravelerId);
            console.log("post traveler id:", post.traveler?.id);
            return (
              <PostCard
                initialData={post}
                key={post.id}
                post={post}
                isOwner={currentUserTravelerId === post.traveler?.id}
                removePost={handleRemovePost}
              />
            );
          })}
        </div>
      </main>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto text-secondary">
            <div className="mb-8 text-6xl">📝</div>
            <h3 className="text-3xl font-bold mb-4 text-primary">
              No posts yet
            </h3>
            <p className="text-lg mb-8">
              Your feed is waiting for content. Be the first to share something
              amazing!
            </p>
            <button className="px-8 py-3 rounded-full font-semibold bg-primary text-bg hover:bg-secondary transition">
              Create Your First Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
