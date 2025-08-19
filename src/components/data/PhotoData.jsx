import { API_URL, fetchWithResponse } from "./Fetcher"; // adjust path if needed

const API_RESOURCE = "photos";

// GET all photos
export async function getPhotos() {
  const token = localStorage.getItem("wayfare_token");
  return fetchWithResponse(`photos`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
}

// DELETE a photo
export async function deletePhoto(id) {
  const token = localStorage.getItem("wayfare_token");
  return fetchWithResponse(`photos${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export const uploadPhoto = async (postId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `http://localhost:8000/posts/${postId}/upload_photo`,
    {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Photo upload failed");

  return res.json(); // {id, url} returned from backend
};

export async function uploadPhotos(postId, files) {
  const token = localStorage.getItem("wayfare_token");
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("file", file); // backend expects "photos" field
  });

  const res = await fetch(`${API_URL}/posts/${postId}/upload_photo`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload photos");
  return res.json();
}
