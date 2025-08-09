import { useEffect, useState } from "react";
import { getPosts } from "../components/data/PostData";
import { PostCard } from "../components/post/Card";
import { PostForm } from "../components/post/Form.tsx";
import { getCategories } from "../components/data/CategoryData.tsx";

interface Post {
  id: number;
  title: string;
  short_description: string;
  location?: string;
  // add other post properties if needed
}

export const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading posts...");

  const toggleForm = async () => {
    if (!showForm) {
      setLoadingCategories(true);
      await getCategories();
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
      <div style={{ minHeight: "100vh" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "2rem" }}>
                <div>Loading...</div>
              </div>
              <p>{loadingMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* Header Section */}
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Home Feed
            </h1>
          </div>
          <p
            style={{
              fontSize: "1.125rem",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            Welcome to your personalized feed — discover, connect, and share
          </p>
        </header>

        <button
          onClick={toggleForm}
          className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-fuchsia-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
        >
          {showForm ? (
            <>
              <span>✕</span>
              Cancel
            </>
          ) : (
            <>
              <span>➕</span>
              Create a Post
            </>
          )}
        </button>

        {/* Post Creation Form */}
        {showForm && (
          <div
            style={{
              padding: "2rem",
              marginBottom: "2rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                🎯 Create New Post
              </h2>
              <p>Document a new experience</p>
            </div>

            {loadingCategories ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ marginBottom: "1rem" }}>Loading...</div>
                <p>Loading categories...</p>
              </div>
            ) : (
              <PostForm
                categories={[]} //passing empty array for now but add 'categories' back later
                onSuccess={() => {
                  getPosts();
                  setShowForm(false);
                }}
              />
            )}
          </div>
        )}

        {/* Posts Grid */}
        <main>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
          >
            {posts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </main>

        {/* Empty State */}
        {posts.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "28rem",
                margin: "0 auto",
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>
                  📝
                </div>
              </div>
              <h3
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                No posts yet
              </h3>
              <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
                Your feed is waiting for content. Be the first to share
                something amazing!
              </p>
              <button
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Create Your First Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
