'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export default function ClerkProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? process.env.CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error(
      'Missing Clerk publishable key. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (or CLERK_PUBLISHABLE_KEY) in Vercel before redeploying.'
    );
    return (
      <div className="min-h-screen bg-[#F7F1EC] px-4 py-12 text-center text-[#5A3A2C]">
        <p className="font-semibold">Authentication is not configured yet.</p>
        <p className="mt-2 text-sm">
          Add your Clerk publishable key in Vercel and redeploy to enable sign-in and sign-up.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  );
}
