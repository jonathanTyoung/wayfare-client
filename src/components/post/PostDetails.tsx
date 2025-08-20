import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../data/PostData.tsx";
import { getCurrentUser } from "../data/UserData.jsx";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { PhotoCarousel } from "./PhotoCarousel.tsx";

export const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [postData, userData] = await Promise.all([
          getPostById(postId),
          getCurrentUser(),
        ]);
        setPost(postData);
        setCurrentUser(userData);
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId]);

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  const isOwner =
    currentUser &&
    post &&
    (currentUser.id === post.userId || currentUser.id === post.traveler?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6] mx-auto mb-4"></div>
          <p className="text-[#78716c]">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#3e2f1c] mb-2">Post Not Found</h2>
          <p className="text-[#78716c] mb-4">
            {error || "This post doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-[#14b8a6] text-[#fafaf9] px-4 py-2 rounded-lg hover:bg-[#0f766e] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#78716c]">
      {/* Header */}
      <div className="bg-[#fafaf9] shadow-sm border-b border-[#2f3e46]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#2f3e46] rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#f9f5eb]" />
          </button>
          <h1 className="text-lg font-semibold">Back</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-[#3e2f1c] rounded-lg shadow-lg border border-[#2f3e46] overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-[#2f3e46] flex flex-col md:flex-row gap-4 md:items-start">
            {/* Avatar */}
            <div className="w-12 h-12 bg-[#14b8a6] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#fafaf9]" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-[#f9f5eb] text-lg mb-1">
                Traveler: {post.traveler?.username || post.traveler?.name || "Anonymous"}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#78716c] mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.updated_at
                    ? new Date(post.updated_at).toLocaleDateString()
                    : "Unknown date"}
                </div>
                {post.location_name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {post.location_name}
                  </div>
                )}
              </div>

              {post.category?.name && (
                <span className="inline-block px-3 py-1 bg-[#14b8a6] text-[#3e2f1c] rounded-full text-sm font-medium">
                  Category: {post.category.name}
                </span>
              )}
            </div>

            {isOwner && (
              <button
                onClick={() =>
                  navigate(`/posts/${postId}/edit`, {
                    state: { fromPostId: postId },
                  })
                }
                className="bg-[#78716c] text-[#fafaf9] px-6 py-2 rounded-lg hover:bg-[#f59e0b] transition font-medium self-start md:self-auto"
              >
                Edit Post
              </button>
            )}
          </div>

          {/* Post Content */}
          <div className="p-6">
            {post.title && (
              <h2 className="text-2xl font-bold text-[#f9f5eb] mb-4">{post.title}</h2>
            )}

            <PhotoCarousel photos={post.photos} />

            {post?.long_form_description && (
              <div className="mb-6 bg-[#2f3e46] rounded-xl p-6 border-l-4 border-[#14b8a6] shadow-inner">
                <div className="text-[#fafaf9] text-base leading-relaxed tracking-wide whitespace-pre-wrap font-light">
                  {post.long_form_description}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="px-5 py-3 bg-[#3e2f1c] border-t border-[#2f3e46] mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 5).map((tag: { id: number; name: string }) => (
                    <span
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className="inline-block bg-[#2f3e46] text-[#78716c] px-2.5 py-1 rounded-full text-xs font-medium border border-[#2f3e46] hover:bg-[#fbbf24] hover:text-[#3e2f46] hover:border-[#fbbf24] transition-all duration-200 cursor-pointer select-none"
                      title={`Filter by #${tag.name}`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                  {post.tags.length > 5 && (
                    <span className="text-xs text-[#78716c] px-2 py-1 opacity-60">
                      +{post.tags.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-[#2f3e46]">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[#78716c] hover:text-[#f59e0b] transition">
                  <Heart className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-[#78716c] hover:text-[#14b8a6] transition">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 text-[#78716c] hover:text-[#fbbf24] transition">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {!isOwner ? (
                <button className="bg-[#14b8a6] text-[#3e2f1c] px-6 py-2 rounded-lg hover:bg-[#0f766e] transition font-medium">
                  Subscribe to {post.traveler?.username || "Traveler"}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-[#3e2f1c] rounded-lg shadow-lg border border-[#2f3e46] p-6">
          <h3 className="text-lg font-semibold text-[#f9f5eb] mb-4">Comments</h3>
          <p className="text-[#78716c] text-center py-8">
            Comments coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};
