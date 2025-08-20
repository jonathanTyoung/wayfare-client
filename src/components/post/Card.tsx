import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";

export function PostCard({
  post,
  removePost,
  isOwner = false,
}: {
  post: any;
  removePost?: (id: number) => void;
  isOwner?: boolean;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(url);
    setMenuOpen(false);
    alert("Link copied to clipboard ✅");
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasLocation = post.latitude && post.longitude;

  return (
    <article className="w-full max-w-2xl mx-auto mb-8 bg-[#292524] rounded-lg border border-gray-600/30 backdrop-blur-sm p-8">
      {/* Header with title, metadata, and menu */}
      <header className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {/* Author and metadata */}
            <div className="inline-flex items-center gap-3 mb-3 px-3 py-2 bg-gray-700/30 border border-gray-600/40 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                  {post.traveler?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span className="text-gray-200 font-medium">
                  {post.traveler?.name || "Unknown Traveler"}
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

              {post.category?.name && (
                <>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <span className="text-blue-400 font-medium">
                    {post.category.name}
                  </span>
                </>
              )}

              {post.location_name && (
                <>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <span className="flex items-center gap-1 text-gray-300">
                    📍 {post.location_name.split(",")[0]}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
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
                        setMenuOpen(false);
                        alert("Liked ❤️");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black-200 hover:bg-gray-700/50 transition-colors border-b border-gray-600/30"
                    >
                      Like
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alert("Saved 📌");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black-200 hover:bg-gray-700/50 transition-colors border-b border-gray-600/30"
                    >
                      Save for Later
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
        </div>
      </header>

      {/* Description */}
      <section className="mb-5">
        <p className="text-gray-300 leading-relaxed text-base line-clamp-3">
          {post.short_description || "No description provided."}
        </p>
      </section>

      {/* Thumbnail or No Media Message */}
      {post.photos && post.photos.length > 0 ? (
        <div className="mb-5 rounded-lg overflow-hidden">
          <img
            src={post.photos[0].url}
            alt={`Thumbnail for ${post.title}`}
            className="w-full h-64 object-cover"
          />
        </div>
      ) : (
        <div className="mb-5 rounded-lg border-2 border-dashed border-gray-600/40 p-8 text-center">
          {/* <div className="text-gray-400 text-sm">No media</div> */}
          <div className="text-gray-500 text-xs mt-1">
            This story doesn't include any photos
          </div>
        </div>
      )}

      {/* Footer with tags and map button */}
      <footer className="flex items-center justify-between gap-4">
        {/* Tags */}
        <div className="flex-1">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag.name || tag)}
                  className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full hover:bg-blue-900/30 hover:text-blue-300 transition-colors"
                >
                  #{typeof tag === "string" ? tag : tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View on Map button */}
        {hasLocation && (
          <button
            onClick={() => {
              navigate(
                `/explore?lat=${encodeURIComponent(
                  post.latitude
                )}&lng=${encodeURIComponent(post.longitude)}`
              );
            }}
            className="px-4 py-2 text-sm font-medium text-black-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-md transition-colors flex-shrink-0"
          >
            View on Map
          </button>
        )}
      </footer>
    </article>
  );
}
