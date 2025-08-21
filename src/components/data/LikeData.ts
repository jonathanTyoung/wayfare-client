// LikeData.ts
import { fetchWithResponse } from "./Fetcher";

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
  return fetch(`${API_URL}/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error(res.status.toString());
    return null; // DELETE usually returns no JSON
  });
};
