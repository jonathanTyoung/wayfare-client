import { useEffect, useState } from "react";
import { getPosts } from "../components/data/PostData";
import { PostCard } from "../components/post/Card";

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
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading posts...");

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
      <div className="flex items-center justify-center min-h-[24rem]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Home Feed</h1>
        <p className="text-slate-400">Welcome to your personalized feed</p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No posts yet
          </h3>
          <p className="text-slate-400">Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};
