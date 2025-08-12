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
