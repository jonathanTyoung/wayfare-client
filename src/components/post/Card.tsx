import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  HiDotsVertical,
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
} from "react-icons/hi";
import { likePost, unlikePost } from "../data/LikeData.ts";
import { bookmarkPost, unbookmarkPost } from "../data/BookmarkData"; // import bookmark API

export function PostCard({
  post,
  currentUserId,
  removePost,
  isOwner = false,
}: {
  post: any;
  currentUserId?: number;
  removePost?: (id: number) => void;
  isOwner?: boolean;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ===== SELF-CONTAINED STATE =====
  const [liked, setLiked] = useState(post.liked_by_user || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [bookmarked, setBookmarked] = useState(
    post.bookmarked_by_user || false
  );

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    setMenuOpen(false);
    alert("Link copied to clipboard ✅");
  };

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== LIKE HANDLER =====
  const toggleLike = async () => {
    const token = localStorage.getItem("wayfare_token");
    if (!currentUserId || !token) return alert("You need to log in");

    try {
      if (liked) {
        await unlikePost(post.id, token);
        setLiked(false);
        setLikesCount((c) => c - 1);
      } else {
        await likePost(post.id, token);
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again");
    }
  };

  // ===== BOOKMARK HANDLER =====
  const toggleBookmark = async () => {
    const token = localStorage.getItem("wayfare_token");
    if (!currentUserId || !token) return alert("You need to log in");

    try {
      if (bookmarked) {
        await unbookmarkPost(post.id, token);
        setBookmarked(false);
      } else {
        await bookmarkPost(post.id, token);
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again");
    }
  };

  const hasLocation = post.latitude && post.longitude;

  return (
    <article className="w-full max-w-2xl mx-auto mb-8 bg-[#292524] rounded-lg border border-gray-600/30 backdrop-blur-sm p-8">
      {/* HEADER */}
      <header className="mb-4 flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="inline-flex items-center gap-3 mb-3 px-3 py-2 bg-gray-700/30 border border-gray-600/40 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {post.traveler?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span className="text-gray-200 font-medium">
                {post.traveler?.name || "Unknown Traveler"}
              </span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-gray-200 font-medium">
                {post.category.name || "Unknown Traveler"}
              </span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-gray-200 font-medium">
                {post.location_name || "Unknown Traveler"}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <span className="text-gray-300">
              {post.updated_at
                ? new Date(post.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date unknown"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white leading-tight hover:text-gray-300 transition-colors">
            <Link
              to={`/posts/${post.id}`}
              className="no-underline text-inherit hover:text-gray-300"
            >
              {post.title}
            </Link>
          </h2>
        </div>

        {/* Three Dots Menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-black-400 hover:text-gray-200"
          >
            <HiDotsVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1f1f1f] border border-gray-600/50 rounded-lg shadow-xl z-20 py-1">
              {isOwner ? (
                <>
                  <Link
                    to={`/posts/${post.id}/edit`}
                    state={{ from: window.location.pathname }}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-black-200 hover:bg-gray-700/50 transition-colors border-b border-gray-600/30 last:border-b-0"
                  >
                    Edit Post
                  </Link>
                  <button
                    onClick={() => {
                      removePost?.(post.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-black-400 hover:bg-red-900/30 transition-colors"
                  >
                    Delete Post
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-4 py-3 text-sm text-black-200 hover:bg-gray-700/50 transition-colors border-b border-gray-600/30"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      toggleBookmark();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-black-200 hover:bg-gray-700/50 transition-colors border-b border-gray-600/30"
                  >
                    {bookmarked ? "Remove Bookmark 📌" : "Bookmark 📌"}
                  </button>
                  <Link
                    to={`/posts/${post.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
                  >
                    View Post
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* DESCRIPTION */}
      <p className="text-gray-300 leading-relaxed text-base line-clamp-3 mb-5">
        {post.short_description || "No description provided."}
      </p>

      {/* THUMBNAIL */}
      {post.photos?.length ? (
        <div className="mb-5 rounded-lg overflow-hidden">
          <img
            src={post.photos[0].url}
            alt={`Thumbnail for ${post.title}`}
            className="w-full h-64 object-cover"
          />
        </div>
      ) : (
        <div className="mb-5 rounded-lg border-2 border-dashed border-gray-600/40 p-8 text-center text-gray-500 text-xs">
          This story doesn't include any photos
        </div>
      )}

      {/* FOOTER */}
      <footer className="flex items-center justify-between gap-4">
        {/* TAGS */}
        <div className="flex-1 flex flex-wrap gap-2">
          {post.tags?.map((tag: any, index: number) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag.name || tag)}
              className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full hover:bg-blue-900/30 hover:text-blue-300 transition-colors"
            >
              #{typeof tag === "string" ? tag : tag.name}
            </button>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {/* LIKE BUTTON */}
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-red-900/20 transition-colors"
          >
            {liked ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-black" />
            )}
            <span className="text-black text-sm">{likesCount}</span>
          </button>

          {/* VIEW ON MAP */}
          {hasLocation && (
            <button
              onClick={() =>
                navigate(
                  `/explore?lat=${encodeURIComponent(
                    post.latitude
                  )}&lng=${encodeURIComponent(post.longitude)}`
                )
              }
              className="px-4 py-2 text-sm font-medium text-black-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-md transition-colors flex-shrink-0"
            >
              View on Map
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
