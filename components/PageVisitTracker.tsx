'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export default function PageVisitTracker() {
  const { userId } = useAuth();
  const pathname = usePathname();
  const hasTracked = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
      return;
    }

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('visit_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('visit_session_id', sessionId);
    }

    // Create a unique key for this page visit to avoid duplicate tracking
    const visitKey = `${pathname}_${sessionId}_${Date.now()}`;

    // Only track if we haven't already tracked this exact visit
    if (hasTracked.current.has(visitKey)) {
      return;
    }

    hasTracked.current.add(visitKey);

    // Track the page visit
    const trackVisit = async () => {
      try {
        await fetch('/api/visits/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: pathname,
            session_id: sessionId,
            clerk_user_id: userId || null,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent || null,
          }),
        });
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    };

    // Track the visit
    trackVisit();

    // Clean up old entries from the tracking set to prevent memory leaks
    if (hasTracked.current.size > 100) {
      const entries = Array.from(hasTracked.current);
      hasTracked.current = new Set(entries.slice(-50));
    }
  }, [pathname, userId]);

  return null; // This component doesn't render anything
}
