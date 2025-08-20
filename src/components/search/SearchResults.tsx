import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostCard } from "../post/Card";
import { getPosts } from "../data/PostData";
import { useUserContext } from "../../context/UserContext";

const useQuery = () => new URLSearchParams(useLocation().search);

export const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useUserContext();

  const currentUserTravelerId = currentUser?.traveler?.id;

  const query = useQuery().get("query") || "";
  const tag = useQuery().get("tag") || "";

  useEffect(() => {
    const fetchFiltered = async () => {
      const allPosts = await getPosts();
      let filtered = allPosts;

      if (tag) {
        filtered = allPosts.filter((post) =>
          post.tags?.some((t) => t.name.toLowerCase() === tag.toLowerCase())
        );
      } else if (query) {
        const searchTerm = query.toLowerCase();
        filtered = allPosts.filter((post) => {
          const matchesTitle = post.title?.toLowerCase().includes(searchTerm);
          const matchesDescription = post.short_description
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesCategory = post.category?.name
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesTraveler = post.traveler?.user
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesTags =
            post.tags?.some((t) => t.name.toLowerCase().includes(searchTerm)) ??
            false;

          return (
            matchesTitle ||
            matchesDescription ||
            matchesCategory ||
            matchesTraveler ||
            matchesTags
          );
        });
      }

      setPosts(filtered);
    };

    fetchFiltered();
  }, [query, tag]);

  return (
    <div className="min-h-screen bg-[#292524] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#f9f5eb]">
          Search Results {query ? `for "${query}"` : ""}
        </h2>

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
          <p className="text-[#78716c] text-lg text-center py-8">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};
