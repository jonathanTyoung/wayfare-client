# Wayfare Client — Followups

## From Fix 2 (dead code sweep)
- [ ] MapComponent.tsx: unused `blueIcon` export and unused `trips` prop,
      left in case trips feature returns. Decide: resurrect or delete.
- [ ] Commented-out `__str__` on Post/Traveler models (API side) — decide
      if intentional placeholders or safe to delete.

## From audit (not yet addressed)
- [ ] TypeScript strict: false, .jsx/.tsx intermixed
- [ ] ESLint doesn't cover .ts/.tsx
- [ ] localStorage token read in ~20 places, bypasses UserContext
