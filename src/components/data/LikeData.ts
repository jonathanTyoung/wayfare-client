import { fetchWithResponse, fetchWithoutResponse } from "./Fetcher";

export const likePost = (postId: number, token: string) => {
  return fetchWithResponse(`posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export const unlikePost = (postId: number, token: string) => {
  return fetchWithoutResponse(`posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};
