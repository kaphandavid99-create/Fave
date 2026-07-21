import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Toggle like for current user + reel (client-side only, no auth)
export async function POST(req: NextRequest) {
  try {
    const { reelId, userId } = (await req.json()) as { reelId?: string; userId?: string };
    if (!reelId) {
      return NextResponse.json({ success: false, error: 'Missing reelId' }, { status: 400 });
    }

    // Use a client-generated user ID or a default one
    const finalUserId = userId || 'anonymous-user';

    // Ensure interactions row exists
    const { data: existing } = await supabase
      .from('reel_interactions')
      .select('liked')
      .eq('reel_id', reelId)
      .eq('clerk_user_id', finalUserId)
      .maybeSingle();

    if (!existing) {
      const { data, error: insertError } = await supabase
        .from('reel_interactions')
        .insert({ clerk_user_id: finalUserId, reel_id: reelId, liked: true, saved: false, comment_count: 0 })
        .select('liked')
        .single();

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, liked: !!data?.liked });
    }

    const nextLiked = !existing.liked;

    const { error: updateError } = await supabase
      .from('reel_interactions')
      .update({ liked: nextLiked })
      .eq('reel_id', reelId)
      .eq('clerk_user_id', finalUserId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, liked: nextLiked });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

