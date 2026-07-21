// Minimal Clerk server helper.
// This project already uses @clerk/nextjs. We expose a thin wrapper
// so API routes can fetch Clerk user id / claims.
//
// If your app already provides a different pattern (middleware/session),
// you can replace usage in API routes.

import { currentUser } from '@clerk/nextjs/server';

export async function getClerkUserId() {
  const user = await currentUser();
  return user?.id ?? null;
}

export const clerkClient = {};

