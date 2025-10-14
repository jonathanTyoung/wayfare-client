// src/helpers/navigation.js
export const getBackPath = (state) => {
  if (!state) return "/";

  switch (state.from) {
    case "profile":
      return `/profile/${state.userId}`;
    case "details":
      return `/posts/${state.postId}`;
    case "home":
      return "/home";
    default:
      return "/";
  }
};
