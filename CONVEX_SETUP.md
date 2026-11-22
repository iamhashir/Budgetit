# Convex setup for Budgetit

## Configured deployment

- Convex Cloud (client queries and mutations): `https://hidden-lark-330.convex.cloud`
- HTTP Actions endpoint (only for HTTP actions): `https://hidden-lark-330.convex.site`

The Expo app uses the cloud URL by default. You can override it by putting `EXPO_PUBLIC_CONVEX_URL` in a local `.env.local`. The Android release workflow also sets this variable. The HTTP Actions URL is not a substitute for the Convex client URL and is not used by the expense form.

## Deploying backend functions

1. Install dependencies: `npm install`.
2. Sign in to Convex: `npx convex login`.
3. Link this repository to the **existing** Convex project corresponding to `hidden-lark-330` using `npx convex dev` and the interactive project selection (do not accidentally create a separate project).
4. Run `npx convex dev --once` to deploy the schema and `expenses:list` / `expenses:add` functions and generate any local client typings.
5. Run `npm run typecheck`, then `npm start` to test the Expo client.

**Authentication is not yet configured.** Both backend functions require an authenticated identity and isolate data by identity subject. The Add page disables saving until sign-in is available. Configure Convex-compatible authentication before storing user financial records. Do not remove the identity checks to make the screen appear functional.

**Status:** The URL is set in app and release build configuration, but connecting to an existing Convex deployment by URL alone does not deploy schema/functions or authenticate users. Those operations have not been completed from the GitHub connector.
