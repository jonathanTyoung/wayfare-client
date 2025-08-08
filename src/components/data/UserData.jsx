export const getCurrentUser = () => {
  const token = localStorage.getItem("wayfare_token");
  return fetch("http://localhost:8000/current_user", {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
}
