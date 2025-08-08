// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from "next/router"
// import { getCurrentUser } from '../components/data/UserData';

// const AppContext = createContext();

// export function AppWrapper({ children }) {
//   const [profile, setProfile] = useState({})
//   const [token, setToken] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     setToken(localStorage.getItem('wayfare_token'))
//   }, [])

//   useEffect(() => {
//     const authRoutes = ['/login', '/register']
//     if (token) {
//       localStorage.setItem('token', token)
//       if (!authRoutes.includes(router.pathname)) {
//         getCurrentUser().then((profileData) => {
//           if (profileData) {
//             setProfile(profileData)
//           }
//         })
//       }
//     }
//   }, [token])

//   return (
//     <AppContext.Provider value={{ profile, token, setToken, setProfile }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useAppContext() {
//   return useContext(AppContext);
// }
