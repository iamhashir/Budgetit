import type { PropsWithChildren } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Public deployment URL; safe to include in a mobile application bundle.
// EXPO_PUBLIC_CONVEX_URL can override it for a separate development deployment.
export const convexUrl =
  process.env.EXPO_PUBLIC_CONVEX_URL || 'https://hidden-lark-330.convex.cloud';

export const convexConfigured = Boolean(convexUrl);
const client = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
