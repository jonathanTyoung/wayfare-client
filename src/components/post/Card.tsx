import { Link, useNavigate } from "react-router-dom";

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

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <article className="p-6 w-full max-w-lg mx-auto my-4 rounded-lg shadow-lg bg-[#2f3e46] border border-gray-700 hover:shadow-xl hover:shadow-blue-500/10 hover:border-gray-600 transition-all duration-300 min-h-[220px] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold pr-3 flex-1 text-white leading-tight line-clamp-2">
            <Link
              to={`/posts/${post.id}`}
              className="no-underline text-white hover:text-blue-400 transition-colors duration-200"
            >
              {post.title}
            </Link>
          </h3>

          <button
            onClick={() =>
              navigate(
                `/explore?lat=${encodeURIComponent(
                  post.latitude
                )}&lng=${encodeURIComponent(post.longitude)}`
              )
            }
            className="px-3 py-1 bg-[#2f3e46] text-white rounded-md hover:bg-[#14b8a6] transition-colors shadow-lg hover:shadow-blue-500/25 hover:scale-105 duration-200"
          >
            View on Map
          </button>
        </div>
      </header>

      {/* Thumbnail */}
      {post.photos && post.photos.length > 0 && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={post.photos[0].url}
            alt={`Thumbnail for ${post.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <section className="px-5 flex-grow">
        <p className="text-sm leading-relaxed text-gray-300 line-clamp-3 mb-4">
          {post.short_description || "No description provided."}
        </p>
      </section>

      {/* Meta information */}
      <div className="px-5 py-3 border-t border-gray-700 bg-gray-750">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-lg">
              {post.traveler?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="text-xs">
              <div className="font-medium text-white">
                {post.traveler?.name || "Unknown Traveler"}
              </div>
              <div className="text-gray-400">
                {post.updated_at
                  ? new Date(post.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date unknown"}
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-gray-400">
              {post.category?.name || "General"}
            </div>
            <div className="text-white font-medium">
              in {post.location_name?.split(",")[0] || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="px-5 py-3 bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="flex flex-wrap gap-3">
              {post.tags.slice(0, 5).map((tag: { id: number; name: string }) => (
                <span
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer select-none text-xs font-medium hover:underline underline-offset-2"
                  title={`Filter by #${tag.name}`}
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 5 && (
                <span className="text-xs text-gray-500 opacity-60">
                  +{post.tags.length - 5}
                </span>
              )}
            {isOwner && removePost && (
              <div className="flex gap-1 ml-3 flex-shrink-0">
                <Link
                  to={`/posts/${post.id}/edit`}
                  state={{ from: window.location.pathname }}
                  className="w-8 h-8 bg-gray-700 hover:bg-[#14b8a6] rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 border border-gray-600 hover:border-blue-500 shadow-lg hover:shadow-blue-500/25"
                  title="Edit"
                >
                  <span className="text-sm">✏️</span>
                </Link>
                <button
                  onClick={() => removePost(post.id)}
                  className="w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 border border-gray-600 hover:border-red-500 shadow-lg hover:shadow-red-500/25"
                  title="Delete"
                >
                  <span className="text-sm">🗑️</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
