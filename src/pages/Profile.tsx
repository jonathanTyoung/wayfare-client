import { useState, useEffect } from "react";
import { getUserProfile } from "../components/data/UserData";
import { getPostsByTraveler } from "../components/data/PostData";
import { PostCard } from "../components/post/Card";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useUserContext();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err?.message || "Unable to load profile");
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchTravelerPosts() {
      if (!currentUser?.traveler?.id) return;

      try {
        const travelerPosts = await getPostsByTraveler(currentUser.traveler.id);
        setPosts(travelerPosts);
      } catch (err) {
        console.error("Error fetching traveler posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchTravelerPosts();
  }, [currentUser]);

  if (loadingProfile) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-bg text-text rounded-lg shadow-md">
      {/* User Info */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary">
          {userProfile.user?.username}
        </h1>
        <p className="text-secondary">Email: {userProfile.user?.email}</p>
        <p className="text-secondary">
          Location: {userProfile.traveler?.location || "Not specified"}
        </p>
        <p className="text-secondary">
          Bio: {userProfile.traveler?.bio || "No bio yet"}
        </p>
      </div>

      {/* User Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-primary">My Posts</h2>

        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-secondary">You haven’t created any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={currentUser.traveler?.id === post.traveler?.id}
                removePost={() =>
                  setPosts(posts.filter((p) => p.id !== post.id))
                }
                renderEditButton={(postId) => (
                  <Link
                    to={`/edit/${postId}`}
                    state={{ from: "/profile" }} // <-- important for routing back
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                )}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
