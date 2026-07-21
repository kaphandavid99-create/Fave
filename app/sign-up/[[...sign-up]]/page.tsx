'use client';

import dynamic from 'next/dynamic';

// Dynamically import SignUp to avoid Clerk UI 10s mount timeout from Turbopack
const DynamicSignUp = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.SignUp })),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#8A4A32]">Loading...</div></div> }
);

export default function SignUpPage() {
  return <DynamicSignUp />;
}

