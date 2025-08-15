import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostCard } from "../post/Card";
import { getPosts } from "../data/PostData";
import { useUserContext } from "../../context/UserContext";

const useQuery = () => new URLSearchParams(useLocation().search);

export const SearchResults = () => {
  const query = useQuery().get("query") || "";
  const [posts, setPosts] = useState([]);
  const { currentUser } = useUserContext();

  const currentUserTravelerId = currentUser?.traveler?.id;

  useEffect(() => {
    const fetchFiltered = async () => {
      const allPosts = await getPosts();
      const filtered = allPosts.filter((post) => {
        const searchTerm = query.toLowerCase();

        return (
          post.title?.toLowerCase().includes(searchTerm) ||
          post.short_description?.toLowerCase().includes(searchTerm) ||
          post.category?.name?.toLowerCase().includes(searchTerm) ||
          post.traveler?.user?.toLowerCase().includes(searchTerm)
        );
      });

      setPosts(filtered);
    };

    fetchFiltered();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Search Results for "{query}"</h2>
      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              initialData={post}
              isOwner={currentUserTravelerId === post.traveler?.id}
              removePost={() =>
                setPosts((prev) => prev.filter((p) => p.id !== post.id))
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-[#a8a29e] text-lg">No posts found.</p>
      )}
    </div>
  );
};
