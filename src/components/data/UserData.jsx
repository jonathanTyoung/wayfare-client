import { fetchWithResponse } from "./Fetcher";

export async function getCurrentUser() {
  const token = localStorage.getItem("wayfare_token");

  if (!token) {
    throw new Error("No token found");
  }

  const user = await fetchWithResponse("/current_user", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return user;
}


export async function getUserProfile() {
  const token = localStorage.getItem("wayfare_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return await fetchWithResponse("/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }
  });
}
