import type { PropsWithChildren } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

export const convexConfigured = Boolean(process.env.EXPO_PUBLIC_CONVEX_URL);
const client = process.env.EXPO_PUBLIC_CONVEX_URL
  ? new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL)
  : null;

/** No fake backend URL: local Add screen remains usable until configured. */
export function ConvexClientProvider({ children }: PropsWithChildren) {
  return client ? <ConvexProvider client={client}>{children}</ConvexProvider> : children;
}
