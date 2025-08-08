import { Link } from "react-router-dom";

export function PostCard({
  post,
  removePost,
  isOwner = false,
  width = "w-full sm:w-1/2 md:w-1/3 lg:w-1/4", // Responsive width
}: {
  post: any;
  removePost?: (id: number) => void;
  isOwner?: boolean;
  width?: string;
}) {
  return (
    <div className={`p-3 ${width}`}>
      <div className="bg-slate-800 rounded-xl shadow-lg hover:shadow-fuchsia-500/20 transition-shadow duration-300 overflow-hidden flex flex-col h-full">
        {/* Post title */}
        <div className="p-4 flex-grow">
          <h2 className="text-xl font-semibold text-fuchsia-300 mb-2">
            <Link to={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-slate-300">
            {post.short_description}
          </p>
        </div>

        {/* Actions for owner */}
        {isOwner && removePost && (
          <div className="flex justify-between border-t border-slate-700 text-sm text-fuchsia-300 p-4">
            <Link
              to={`/posts/${post.id}/edit`}
              className="hover:text-fuchsia-400 hover:underline transition"
            >
              Edit
            </Link>
            <button
              onClick={() => removePost(post.id)}
              className="hover:text-red-400 hover:underline transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
