import { NextRequest, NextResponse } from 'next/server';
import { getClerkUserId } from '@/lib/clerk-server';
import { supabase } from '@/lib/supabase';

// Create a comment for the current user + reel
export async function POST(req: NextRequest) {
  try {
    const userId = await getClerkUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { reelId, text } = (await req.json()) as { reelId?: string; text?: string };
    if (!reelId) return NextResponse.json({ success: false, error: 'Missing reelId' }, { status: 400 });
    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Missing text' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reel_comments')
      .insert({ clerk_user_id: userId, reel_id: reelId, text: text.trim() })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Optional: increment comment_count in reel_interactions (ignore if the row doesn't exist yet)
    const { error: incError } = await supabase.rpc('increment_reel_interactions_comment_count', {
      reel_id: reelId,
      clerk_user_id: userId,
    } as any);
    if (incError) {
      // don't fail the request just because increment failed
      console.warn('Failed to increment comment_count:', incError.message);
    }


    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

