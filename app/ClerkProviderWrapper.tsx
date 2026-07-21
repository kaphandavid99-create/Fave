'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import ClerkProvider with ssr: false to prevent Clerk from loading
// on the server, which can cause 10s mount timeout with Turbopack.
// Clerk UI bundles are loaded only on the client after hydration.
const ClerkProviderClient = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.ClerkProvider })),
  { ssr: false }
);

/**
 * Client-side wrapper for ClerkProvider to ensure proper hydration
 * and avoid SSR/client markup mismatches with Turbopack.
 * 
 * This component is a Client Component, so it can use next/dynamic with ssr: false.
 */
export default function ClerkProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <ClerkProviderClient>{children}</ClerkProviderClient>;
}
