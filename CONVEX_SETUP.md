# Convex integration (work in progress)

The Add page has optional Convex wiring. Without `EXPO_PUBLIC_CONVEX_URL` it uses the existing **session-only** form. With it, the connected screen is used and requires authentication.

1. Install dependencies: `npm install`
2. Sign into your Convex account: `npx convex login`
3. Initialize and deploy from project root: `npx convex dev --once` (or keep `npx convex dev` running during development). This generates `convex/_generated/` and a local `.env.local` with your URL.
4. Ensure `EXPO_PUBLIC_CONVEX_URL` points to the same deployment as `CONVEX_DEPLOYMENT`.
5. Run `npm start`.

**Security:** `convex/expenses.ts` requires `ctx.auth.getUserIdentity()` for both list and insert and partitions records by authenticated subject. No authentication provider/sign-in flow is included yet. **Do not remove these checks or use public financial-data mutations.** Wire a supported identity provider and Convex auth config before testing persisted expenses.

Convex backend has not been deployed or tested from this connector session. Run `npm run typecheck` after `npx convex dev --once` generates the typed API.
