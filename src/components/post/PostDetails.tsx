import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Bookmark,
} from "lucide-react";
import { PhotoCarousel } from "./PhotoCarousel.tsx";
import { HiDotsVertical } from "react-icons/hi";

export const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const isOwner =
    currentUser &&
    post &&
    (currentUser.id === post.userId || currentUser.id === post.traveler?.id);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url);
    setMenuOpen(false);
    alert("Link copied to clipboard ✅");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-600 border-t-stone-100 animate-spin mx-auto mb-4"></div>
          <p className="text-stone-400">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-stone-800 border border-stone-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-stone-400">📖</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mb-3">
            Story Not Found
          </h2>
          <p className="text-stone-400 mb-6 leading-relaxed">
            {error || "This story doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-stone-100 hover:bg-stone-200 text-[#292524] px-6 py-2.5 font-medium transition-colors border border-stone-100"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524] relative">
      {/* Header */}
      <header className="border-b border-stone-600/10 bg-[#292524] sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-stone-200 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      {/* Main Article */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <article className="shadow-sm border border-white/50 relative rounded-lg overflow-hidden">
          {/* Top Right Menu */}
          <div className="absolute top-4 right-4" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors bg-transparent"
            >
              <HiDotsVertical
                size={22}
                className="text-gray-400 hover:text-gray-200"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-lg z-50">
                {isOwner ? (
                  <>
                    <Link
                      to={`/posts/${postId}/edit`}
                      state={{ fromPostId: postId }}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white rounded-t-md"
                    >
                      Edit Story
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alert("Deleted 🗑️");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white rounded-b-md"
                    >
                      Delete Story
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white rounded-t-md"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alert("Liked ❤️");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                    >
                      Like
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alert("Saved 📌");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-12 py-16">
            {post.category?.name && (
              <div className="mb-4">
                <span className="text-yellow-300 text-sm font-medium tracking-wide uppercase">
                  {post.category.name}
                </span>
              </div>
            )}

            {post.title && (
              <h1 className="text-5xl font-bold text-white mb-12 leading-tight tracking-tight">
                {post.title}
              </h1>
            )}

            {/* Author & Meta */}
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-stone-600/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-300 flex items-center justify-center rounded-full">
                  <User className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <div className="font-medium text-white text-lg">
                    {post.traveler?.username ||
                      post.traveler?.name ||
                      "Anonymous Traveler"}
                  </div>
                  <div className="flex items-center gap-4 text-stone-300 mt-1 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {post.updated_at
                        ? new Date(post.updated_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Unknown date"}
                    </span>
                    {post.location_name && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {post.location_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {!isOwner && (
                  <button className="bg-white hover:bg-stone-100 text-black px-6 py-2 text-sm font-medium transition-colors">
                    Follow
                  </button>
                )}
              </div>
            </div>

            {/* Media */}
            <div className="mb-12">
              {post.photos && post.photos.length > 0 ? (
                <PhotoCarousel photos={post.photos} />
              ) : (
                <div className="bg-stone-600/20 border border-stone-600/30 p-16 text-center">
                  <div className="text-stone-400 text-base mb-2">No media</div>
                  <div className="text-stone-500 text-sm">
                    This story doesn't include any photos
                  </div>
                </div>
              )}
            </div>

            {/* Long Description */}
            {post.long_form_description && (
              <div className="mb-16">
                <div className="text-white text-xl leading-relaxed whitespace-pre-wrap font-light tracking-wide">
                  {post.long_form_description}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-wrap gap-3">
                  {post.tags
                    .slice(0, 8)
                    .map((tag: { id: number; name: string }) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className="text-white hover:text-yellow-300 transition-colors text-sm underline"
                        title={`View posts tagged with #${tag.name}`}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  {post.tags.length > 8 && (
                    <span className="text-stone-400 text-sm">
                      +{post.tags.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-12 py-8 border-t border-stone-600/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button className="bg-yellow-300 hover:bg-yellow-400 p-2.5 transition-colors">
                  <Heart className="w-5 h-5 text-black" />
                </button>
                <button className="bg-yellow-300 hover:bg-yellow-400 p-2.5 transition-colors">
                  <MessageCircle className="w-5 h-5 text-black" />
                </button>
                <button className="bg-yellow-300 hover:bg-yellow-400 p-2.5 transition-colors">
                  <Share2 className="w-5 h-5 text-black" />
                </button>
                <button className="bg-yellow-300 hover:bg-yellow-400 p-2.5 transition-colors">
                  <Bookmark className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comments */}
        <section className="mt-12 bg-[#78716c] border-b border-stone-600/20 px-12 py-16 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-8">Comments</h3>
          <div className="text-center py-16">
            <MessageCircle className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">No comments yet</p>
            <p className="text-stone-300">
              Be the first to share your thoughts about this story
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
