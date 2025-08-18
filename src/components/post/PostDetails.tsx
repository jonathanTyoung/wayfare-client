import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../data/PostData.tsx";
import { getCurrentUser } from "../data/UserData.jsx";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Edit2,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

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
        // Fetch both post and current user data
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

  // Check if current user is the owner of the post
  const isOwner =
    currentUser &&
    post &&
    (currentUser.id === post.userId || currentUser.id === post.traveler?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "This post doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with Back Button */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-700 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-100" />
          </button>
          <h1 className="text-lg font-semibold">Home</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
          {/* Post Header - User Info */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-900" />
              </div>

              {/* Info */}
              <div className="flex-1">
                {/* Traveler Name */}
                <h3 className="font-semibold text-gray-100 text-lg mb-1">
                  Traveler:{" "}
                  {post.traveler?.username ||
                    post.traveler?.name ||
                    "Anonymous"}
                </h3>

                {/* Date and Location */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
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

                {/* Category */}
                {post.category?.name && (
                  <span className="inline-block px-3 py-1 bg-purple-700 text-purple-200 rounded-full text-sm font-medium">
                    Category: {post.category.name}
                  </span>
                )}
              </div>

              {/* Edit Button */}
              {isOwner && (
                <button
                  onClick={() =>
                    navigate(`/posts/${postId}/edit`, {
                      state: { fromPostId: postId },
                    })
                  }
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Edit Post
                </button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {/* Title */}
            {post.title && (
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                {post.title}
              </h2>
            )}

            {/* Post Image */}
            {post.imageUrl && (
              <div className="relative mb-6">
                <img
                  src={post.imageUrl}
                  alt={post.title || "Post image"}
                  className="w-full max-h-96 object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}

            {/* Description */}
            {post.short_description && (
              <div className="mb-6 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.short_description}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-black-300 hover:text-red-500 transition">
                  <Heart className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-black-300 hover:text-blue-500 transition">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 text-black-300 hover:text-green-500 transition">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {!isOwner ? (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Subscribe to {post.traveler.username}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/posts/${postId}/edit`)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Edit Post
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Comments</h3>
          <p className="text-gray-400 text-center py-8">
            Comments coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};
