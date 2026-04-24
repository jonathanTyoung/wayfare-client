import { API_URL, fetchWithResponse } from "./Fetcher";

export function getPosts() {
  const token = localStorage.getItem('wayfare_token');
  return fetchWithResponse('posts', {
    headers: {
      Authorization: `Token ${token}`,
    }
  });
}

export async function createPost(postData, token) {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create post: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function deletePost(id: number) {
  const token = localStorage.getItem("wayfare_token");

  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
  return true;
}

export async function getPostById(postId) {
  const token = localStorage.getItem("wayfare_token");
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
}

export async function updatePost(postId, updatedData, token) {
  return fetchWithResponse(`posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
}

export async function getPostsByTraveler(travelerId: number) {
  const token = localStorage.getItem("wayfare_token");

  return fetchWithResponse(`posts/traveler/${travelerId}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}
