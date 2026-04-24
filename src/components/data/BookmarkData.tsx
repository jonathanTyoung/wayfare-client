import { fetchWithResponse, fetchWithoutResponse } from "./Fetcher";

export const bookmarkPost = (postId: number, token: string) => {
  return fetchWithResponse(`posts/${postId}/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export const unbookmarkPost = (postId: number, token: string) => {
  return fetchWithoutResponse(`posts/${postId}/bookmark`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};
