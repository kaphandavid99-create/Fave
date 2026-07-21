'use client';

import dynamic from 'next/dynamic';

// Dynamically import SignIn to avoid Clerk UI 10s mount timeout from Turbopack
const DynamicSignIn = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.SignIn })),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#8A4A32]">Loading...</div></div> }
);

export default function SignInPage() {
  return <DynamicSignIn />;
}

