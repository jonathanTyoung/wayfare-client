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
    <article className="w-full max-w-lg mx-auto my-4 rounded-lg shadow-sm bg-[#1c1917] border border-[#333333] hover:shadow-md transition-all duration-300 min-h-[220px] flex flex-col overflow-hidden hover:border-[#44403c]">
      {/* Header - Clean title area */}
      <header className="relative px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold pr-3 flex-1 text-[#f5f5f4] leading-tight line-clamp-2">
            <Link
              to={`/posts/${post.id}`}
              className="no-underline text-[#f5f5f4] hover:text-[#fbbf24] transition-colors duration-200"
            >
              {post.title}
            </Link>
          </h3>

          {/* Owner actions - minimal icons */}
          {isOwner && removePost && (
            <div className="flex gap-1 ml-3 flex-shrink-0">
              <Link
                to={`/posts/${post.id}/edit`}
                state={{ from: window.location.pathname }}
                className="w-8 h-8 bg-[#292524] hover:bg-[#14b8a6] rounded-md flex items-center justify-center text-[#a8a29e] hover:text-white transition-all duration-200 hover:scale-105 border border-[#333333] hover:border-[#14b8a6]"
                title="Edit"
              >
                <span className="text-sm">✏️</span>
              </Link>
              <button
                onClick={() => removePost(post.id)}
                className="w-8 h-8 bg-[#292524] hover:bg-[#f59e0b] rounded-md flex items-center justify-center text-[#a8a29e] hover:text-white transition-all duration-200 hover:scale-105 border border-[#333333] hover:border-[#f59e0b]"
                title="Delete"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>
          )}
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

      {/* Content area - Description */}
      <section className="px-5 flex-grow">
        <p className="text-sm leading-relaxed text-[#a8a29e] line-clamp-3 mb-4">
          {post.short_description || "No description provided."}
        </p>
      </section>

      {/* Meta information */}
      <div className="px-5 py-3 border-t border-[#333333] bg-[#121212]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#14b8a6] rounded-full flex items-center justify-center text-xs font-medium text-white">
              {post.traveler?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="text-xs">
              <div className="font-medium text-[#f5f5f4]">
                {post.traveler?.name || "Unknown Traveler"}
              </div>
              <div className="text-[#a8a29e]">
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


        {/* view on map button */}
          <button
            onClick={() =>
              navigate(
                `/explore?lat=${encodeURIComponent(
                  post.latitude
                )}&lng=${encodeURIComponent(post.longitude)}`
              )
            }
            className="px-3 py-1 bg-[#14b8a6] text-white rounded-md hover:bg-[#0f766e] transition-colors"
          >
            View on Map
          </button>

          <div className="text-right text-xs">
            <div className="text-[#a8a29e]">
              {post.category?.name || "General"}
            </div>
            <div className="text-[#f5f5f4] font-medium">
              in {post.location_name?.split(",")[0] || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-5 py-3 bg-[#0f0f0f] border-t border-[#333333] mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 5).map((tag: { id: number; name: string }) => (
              <span
                key={tag.id}
                onClick={() => handleTagClick(tag.name)}
                className="inline-block bg-[#1c1917] text-[#a8a29e] px-2.5 py-1 rounded-full text-xs font-medium border border-[#333333] hover:bg-[#fbbf24] hover:text-[#121212] hover:border-[#fbbf24] transition-all duration-200 cursor-pointer select-none"
                title={`Filter by #${tag.name}`}
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="text-xs text-[#a8a29e] px-2 py-1 opacity-60">
                +{post.tags.length - 5}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
