import { Link } from "react-router-dom";

export function PostCard({
  post,
  removePost,
  isOwner = false,
}: {
  post: any;
  removePost?: (id: number) => void;
  isOwner?: boolean;
}) {
  return (
    <article className="max-w-xl mx-auto my-4 rounded-xl shadow-lg bg-yellow-50 text-black font-sans flex flex-col overflow-hidden">
      {/* Title */}
      <header className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold m-0">
          <Link
            to={`/posts/${post.id}`}
            className="no-underline text-gray-900 hover:underline"
          >
            {post.title}
          </Link>
        </h2>
      </header>

      {/* Description */}
      <section className="p-6 text-base leading-relaxed text-gray-700 flex-grow">
        {post.short_description || "No description provided."}
      </section>

      {/* Meta info */}
      <footer className="p-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
        <span>
          <strong className="text-gray-700">Category:</strong>{" "}
          {post.category?.name || "Unknown"}
        </span>
        <span>
          <strong className="text-gray-700">Traveler:</strong>{" "}
          {post.traveler?.name || "Unknown"}
        </span>
        <span>
          <strong className="text-gray-700">Location:</strong>{" "}
          {post.location_name || "Unknown"}
        </span>
        <span>
          <strong className="text-gray-700">Last Updated:</strong>{" "}
          {post.updated_at
            ? new Date(post.updated_at).toLocaleDateString()
            : "Unknown"}
        </span>
      </footer>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
          {post.tags.map((tag: { id: number; name: string }) => (
            <span
              key={tag.id}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Owner actions */}
      {isOwner && removePost && (
        <div className="p-4 border-t border-gray-200 flex justify-end gap-4">
          <Link
            to={`/posts/${post.id}/edit`}
            state={{ from: window.location.pathname }} // <-- dynamically record current page
            className="text-blue-600 font-semibold hover:underline"
          >
            Edit Post
          </Link>
          <button
            onClick={() => removePost(post.id)}
            className="text-red-600 font-semibold hover:underline cursor-pointer bg-transparent border-none"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
