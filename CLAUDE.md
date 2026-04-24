# Wayfare Client — Claude Code session context

## Project
- React + Vite frontend for Wayfare, a geotagged storytelling app (Django/DRF backend lives in a sibling repo).
- Stack: React 19, Vite 7, TypeScript (non-strict), Tailwind CSS 3, react-router-dom 7, react-leaflet 5, lucide-react + react-icons, lodash (for debounce).

## Running locally
- `npm install`
- `npm run dev` — Vite dev server (default port 5173).
- `npm run build` — production build to `dist/`.
- `npm run lint` — ESLint (covers `.js`/`.jsx` only; see Known tech debt).
- API URL comes from `VITE_API_URL` in `.env`. Defaults to `http://localhost:8000` via `import.meta.env.VITE_API_URL ?? 'http://localhost:8000'` in `src/components/data/Fetcher.tsx`. No runtime validation — missing env var silently falls back.

## Architecture notes
- Routing: `src/components/ApplicationViews.tsx` → `Authorized.jsx` (token gate) → `Layout` → page. Pages in `src/pages/`.
- Auth: token stored in `localStorage` under key `"wayfare_token"`. Read directly in ~20 call sites across components and data modules. `src/context/UserContext.tsx` exists but is underused. **Don't expand the direct-localStorage pattern** and don't refactor to context without a focused pass — tracked in FOLLOWUPS.md.
- HTTP: `src/components/data/Fetcher.tsx` wraps `fetch` with `fetchWithResponse` / `fetchWithoutResponse`. Each data module (`PostData`, `CommentData`, etc.) attaches its own `Authorization: Token ${token}` header.
- Comments: `src/components/post/CommentSection.tsx` + `src/components/data/CommentData.ts` handle nested replies. API shape: top-level comments carry a `replies: Reply[]` array; `parent_id` is the write field (client uses `parentId`, serialized as `parent_id`). Optimistic updates for both top-level and reply paths.
- Post detail payload carries `likes_count`, `bookmarks_count`, `liked_by_user`, `bookmarked_by_user`, and a nested `comments` array inline — **don't fetch those separately**. Toggle endpoints update state locally, not via refetch.
- Map: `src/components/map/MapComponent.tsx` uses react-leaflet with custom SVG icons. `MapComponent` has an unused `blueIcon` export and an unused `trips` prop preserved in case the trips feature returns — tracked in FOLLOWUPS.md.

## Conventions
- HTTP via `fetch` (not Axios). Don't add Axios.
- Styling via Tailwind + CSS vars in `src/index.css`. Don't add SCSS or CSS modules.
- TypeScript is **not** in strict mode (`tsconfig.json` has `"strict": false`); `.jsx` and `.tsx` coexist. Intentional for now — see Out of scope.
- DRF list endpoints (`/likes`, `/bookmarks`, `/comments`, and any newly-paginated ones) return `{ count, next, previous, results }`, not raw arrays. Consume `.results` for list data.
- Route paths: `"/home"`, `"/profile"`, `"/explore"`, `"/posts/:postId"`, `"/search"`, `"/login"`, `"/register"`. Public routes: `"/"` (landing), `"/login"`, `"/register"`. Everything under `Authorized` requires a token.

## Known tech debt
See [FOLLOWUPS.md](FOLLOWUPS.md). Don't duplicate here.

## Out of scope without asking
- `localStorage` → `UserContext` refactor (needs a focused pass across ~20 call sites).
- TypeScript `strict: true` migration (will surface real errors; plan separately).
- `.jsx` → `.tsx` unification (including `App.jsx`, `Login.jsx`, `Register.jsx`, `Authorized.jsx`, `PhotoData.jsx`, `UserData.jsx`, `main.jsx`).
- Visual redesign — planned for a separate reimagine branch, don't start here.
