import { NextRequest, NextResponse } from 'next/server';

// Minimal in-memory notifications endpoint.
// This makes the bell functional end-to-end (UI -> API -> UI).
// Replace with DB-backed notifications when you add a notifications table.

type Notification = {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
  type?: 'booking' | 'promotion' | 'info' | 'reminder';
  icon?: string;
};

const notificationsByUser: Record<string, Notification[]> = {
  demo: [
    {
      id: 'n1',
      message: 'New braiding styles available! Check out our latest trends.',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
      link: '/gallery',
      type: 'info',
      icon: 'Sparkles',
    },
    {
      id: 'n2',
      message: 'Special offer: 20% off your first booking this week!',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
      link: '/book',
      type: 'promotion',
      icon: 'Tag',
    },
    {
      id: 'n3',
      message: 'Your appointment reminder: Don\'t forget your booking tomorrow!',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: false,
      link: '/profile/bookings',
      type: 'reminder',
      icon: 'Calendar',
    },
    {
      id: 'n4',
      message: 'We\'ve added new services to our menu - book now!',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
      link: '/services',
      type: 'info',
      icon: 'Scissors',
    },
  ],
};

function getUserKey(req: NextRequest) {
  // Clerk session may not be available here depending on setup.
  // For now, we use the auth header if present; otherwise fallback to demo.
  const user = req.headers.get('x-user-id');
  return user && user.trim().length ? user.trim() : 'demo';
}

export async function GET(req: NextRequest) {
  try {
    const userKey = getUserKey(req);
    const list = notificationsByUser[userKey] ?? [];

    const unreadCount = list.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      data: {
        unreadCount,
        notifications: list
          .slice()
          .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // Mark all as read
  try {
    const userKey = getUserKey(req);
    const list = notificationsByUser[userKey] ?? [];

    notificationsByUser[userKey] = list.map((n) => ({ ...n, read: true }));

    return NextResponse.json({
      success: true,
      data: { unreadCount: 0 },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 },
    );
  }
}


