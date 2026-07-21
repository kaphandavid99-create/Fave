import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Optional: allow only admins later. For now this is a simple server-side clear.
    // You can enhance with Clerk role checks when needed.
    const body = await request.json().catch(() => ({} as { status?: string }));
    const status = body?.status as string | undefined;

    // Note: avoid relying on Supabase builder typing here.
    const { error } = status
      ? await supabase.from('bookings').delete().eq('status', status)
      : await supabase.from('bookings').delete();
    if (error) throw error;

    return NextResponse.json({ success: true, cleared: status ? `status=${status}` : 'all' });
  } catch (error) {
    console.error('Error clearing bookings:', error);
    return NextResponse.json(
      { error: 'Failed to clear bookings' },
      { status: 500 }
    );
  }
}

