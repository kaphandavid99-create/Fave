'use client';

import { Suspense } from 'react';
import BookingPage from './book/page';

export default function BookIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#FFF5F2]">
          <div className="w-12 h-12 border-2 border-[#6F3D2E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingPage />
    </Suspense>
  );
}

