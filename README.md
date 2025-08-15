# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






Things to elaborate on:

CLIENT
1. routing of form pages will take user back to wherever they entered the form from (e.g., "/home" vs "/profile") when user clicks on create/update or back buttons

2. Debounce Method
- a modern method used for fewer API calls  
- used on the location search when user is filling out their form
- used in the search bar for filtering posts #stretch goal yet to be achieved 

SERVER
1. handling of tags, i.e., when the user deletes a Post, the tags with it are deleted unless in use on another post. Tags are also always stored in DB in lowerCase format, and cannot be repeated

