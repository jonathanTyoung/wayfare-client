import { fetchWithResponse } from "./Fetcher";


export function getCategories() {
  const token = localStorage.getItem('wayfare_token');

  return fetchWithResponse('categories', {
    headers: {
      Authorization: `Token ${token}`
    }
  });
}


// export const getCategories = () => {
//   const token = localStorage.getItem('wayfare_token');
  
//   return fetchWithResponse("categories", {
//     headers: {
//       "Authorization": `Token ${token}`,
//       "Content-Type": "application/json"
//     }
//   });
// };