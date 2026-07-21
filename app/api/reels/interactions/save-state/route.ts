import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { reelId, userId } = (await req.json()) as { reelId?: string; userId?: string };
    if (!reelId) {
      return NextResponse.json({ success: false, error: 'Missing reelId' }, { status: 400 });
    }

    // Use a client-generated user ID or a default one
    const finalUserId = userId || 'anonymous-user';

    const { data, error } = await supabase
      .from('reel_interactions')
      .select('saved')
      .eq('reel_id', reelId)
      .eq('clerk_user_id', finalUserId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: !!data?.saved });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}
