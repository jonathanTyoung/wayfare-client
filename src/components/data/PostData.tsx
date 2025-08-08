import { fetchWithResponse } from "./Fetcher";


export function getPosts() {
  const token = localStorage.getItem('wayfare_token');
  return fetchWithResponse('posts', {
    headers: {
      Authorization: `Token ${token}`, // or 'Bearer' if JWT
    }
  });
}
