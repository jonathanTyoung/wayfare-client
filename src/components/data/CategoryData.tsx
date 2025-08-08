import { fetchWithResponse } from "./Fetcher";


export function getCategories() {
  return fetchWithResponse('categories', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}