import { fetchWithResponse } from "./Fetcher.tsx";

// Fetcher.tsx
export const API_URL = "http://localhost:8000"; // no trailing slash

// Bookmark
export const bookmarkPost = (postId: number, token: string) => {
  return fetchWithResponse(`/posts/${postId}/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

// Unbookmark
export async function unbookmarkPost(postId: number, token: string) {
  try {
    const response = await fetch(`http://localhost:8000/posts/${postId}/bookmark`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (response.status === 204) {
      return { status: "unbookmarked" };
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.status.toString());
    }

    return response.json();
  } catch (err: any) {
    console.error("Unbookmark failed:", err);
    return { status: "error" }; // Always return something
  }
}
