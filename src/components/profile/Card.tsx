// ProfileCard.jsx
export const ProfileCard = ({
  userProfile,
  loading = false,
  error = null,
  variant = "default",
}) => {
  if (loading) return <p className="text-[#d6d3d1]">Loading profile...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!userProfile) return null;

  const baseClasses = "bg-gray-800 border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300";
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
            className={`font-bold text-white ${
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
              <p className="text-[#d6d3d1] mt-3 flex items-center gap-2">
                <span className="text-[#fbbf24]">📍</span>
                {userProfile.traveler?.location || "Location not specified"}
              </p>
              <p className="text-[#d6d3d1] mt-2 leading-relaxed">
                {userProfile.traveler?.bio || "No bio yet"}
              </p>
            </>
          )}

          {variant === "mini" && userProfile.traveler?.location && (
            <p className="text-[#d6d3d1] text-sm mt-2 flex items-center gap-1">
              <span className="text-[#fbbf24]">📍</span>
              {userProfile.traveler.location}
            </p>
          )}
        </div>

        {/* Avatar */}
        <div className="ml-6 flex-shrink-0">
          {userProfile.user?.avatarUrl ? (
            <img
              src={userProfile.user.avatarUrl}
              alt={`${userProfile.user.name}'s avatar`}
              className={`rounded-full object-cover ring-4 ring-[#14b8a6] shadow-lg hover:ring-[#fbbf24] transition-all duration-300 ${
                variant === "mini"
                  ? "w-12 h-12"
                  : variant === "detailed"
                  ? "w-20 h-20"
                  : "w-16 h-16"
              }`}
            />
          ) : (
            <div
              className={`bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-[#14b8a6]/20 hover:ring-[#fbbf24]/40 hover:scale-105 transition-all duration-300 ${
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
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-[#14b8a6] hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <p className="text-3xl font-bold text-[#fbbf24] mb-1">0</p>
              <p className="text-[#d6d3d1] text-sm font-medium">Posts</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-[#14b8a6] hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <p className="text-3xl font-bold text-[#14b8a6] mb-1">0</p>
              <p className="text-[#d6d3d1] text-sm font-medium">Following</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-[#14b8a6] hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <p className="text-3xl font-bold text-[#14b8a6] mb-1">0</p>
              <p className="text-[#d6d3d1] text-sm font-medium">Followers</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-[#14b8a6] hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <p className="text-3xl font-bold text-red-400 mb-1">0</p>
              <p className="text-[#d6d3d1] text-sm font-medium">Likes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};