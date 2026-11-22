# Add tab crash fix

The installed APK crashed when opening Add. The connected screen called `useConvexAuth()` under a plain `ConvexProvider`, without `ConvexProviderWithAuth` or an auth-specific adapter.

Until sign-in and Convex authentication are installed, the navigation uses the local `AddScreen` instead of `ConnectedAddScreen`. Expenses entered here are **session-only**; they are not saved to Convex.

The Convex schema, backend functions, deployment URL, and connected screen source remain in the repository for a future authenticated integration. Do not switch navigation back to `ConnectedAddScreen` until it is wrapped in the proper authentication provider and tested with a configured user sign-in flow.

Run `npm run typecheck` and the Android release workflow to validate the change, then test navigating Home → Add → Settings on a device.
