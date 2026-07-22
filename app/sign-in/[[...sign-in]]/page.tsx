'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F1EC] px-4 py-12">
      <SignIn
        path="/sign-in"
        routing="path"
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}

