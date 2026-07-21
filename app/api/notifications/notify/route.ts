import { NextRequest, NextResponse } from 'next/server';

type Notification = {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
};

const notificationsByUser: Record<string, Notification[]> = {
  demo: [
    {
      id: 'n1',
      message: 'Welcome! You have new updates available.',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
    },
    {
      id: 'n2',
      message: 'Your booking request was received.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      read: false,
    },
  ],
};

function getUserKey(req: NextRequest) {
  const user = req.headers.get('x-user-id');
  return user && user.trim().length ? user.trim() : 'demo';
}

export async function POST(req: NextRequest) {
  try {
    const userKey = getUserKey(req);
    const body = await req.json().catch(() => ({}));

    const message = typeof body?.message === 'string' ? body.message : null;
    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const notification: Notification = {
      id: `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      message,
      created_at: new Date().toISOString(),
      read: false,
    };

    notificationsByUser[userKey] = [notification, ...(notificationsByUser[userKey] ?? [])];

    return NextResponse.json({ success: true, data: { unreadCount: notificationsByUser[userKey].filter((n) => !n.read).length } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

