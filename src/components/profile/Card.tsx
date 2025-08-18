// ProfileCard.jsx
export const ProfileCard = ({
  userProfile,
  loading = false,
  error = null,
  variant = "default",
}) => {
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userProfile) return null;

  const baseClasses = "bg-bg text-text rounded-lg shadow-md";
  const variantClasses = {
    default: "p-6 mb-12",
    mini: "p-4 mb-6",
    detailed: "p-8 mb-16",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1
            className={`font-bold text-primary ${
              variant === "mini"
                ? "text-2xl"
                : variant === "detailed"
                ? "text-5xl"
                : "text-4xl"
            }`}
          >
            {userProfile.user?.name}
          </h1>

          {variant !== "mini" && (
            <>
              <p className="text-secondary mt-2">
                📍 {userProfile.traveler?.location || "Location not specified"}
              </p>
              <p className="text-secondary mt-1">
                ✍️ {userProfile.traveler?.bio || "No bio yet"}
              </p>
            </>
          )}

          {variant === "mini" && userProfile.traveler?.location && (
            <p className="text-secondary text-sm mt-1">
              📍 {userProfile.traveler.location}
            </p>
          )}
        </div>

        {/* Avatar placeholder - you can add this later */}
        <div className="ml-4 flex-shrink-0">
          {userProfile.user?.avatarUrl ? (
            <img
              src={userProfile.user.avatarUrl}
              alt={`${userProfile.user.name}'s avatar`}
              className={`rounded-full object-cover ${
                variant === "mini"
                  ? "w-12 h-12"
                  : variant === "detailed"
                  ? "w-20 h-20"
                  : "w-16 h-16"
              }`}
            />
          ) : (
            <div
              className={`bg-tealCustom text-white rounded-full flex items-center justify-center font-bold ${
                variant === "mini"
                  ? "w-12 h-12 text-sm"
                  : variant === "detailed"
                  ? "w-20 h-20 text-2xl"
                  : "w-16 h-16 text-lg"
              }`}
            >
              {userProfile.user?.name
                ? String(userProfile.user.name).trim().charAt(0).toUpperCase()
                : "?"}
            </div>
          )}
        </div>
      </div>

      {variant === "detailed" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-secondary text-sm">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-secondary text-sm">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-secondary text-sm">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-secondary text-sm">Likes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
