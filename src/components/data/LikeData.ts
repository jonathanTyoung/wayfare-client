// LikeData.ts
import { API_URL, fetchWithResponse } from "./Fetcher";

export const likePost = (postId: number, token: string) => {
  return fetchWithResponse(`posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export async function unlikePost(postId: number, token: string) {
  const response = await fetch(`http://localhost:8000/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
  return response;
}
