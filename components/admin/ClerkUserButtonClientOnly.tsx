'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Calendar } from 'lucide-react';

export default function ClerkUserButtonClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Render only after the client has mounted to avoid SSR/client markup differences.
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonPopoverCard: {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Bookings"
          labelIcon={<Calendar size={16} />}
          href="/profile/bookings"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

