import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET() {
  try {
    // If there is no interactions data yet, return zeros.
    // Likes: sum(reel_interactions.liked)
    // Saves: sum(reel_interactions.saved)
    // Views: sum(reels.view_count) (your schema already has this)
    // Comments: sum(reel_interactions.comment_count) if present; fallback to reel_comments count.

    const [viewsRes, likesRes, savesRes, commentsCountRes] = await Promise.all([
      supabaseAdmin
        .from('reels')
        .select('view_count')
        .then((r) => r),
      supabaseAdmin
        .from('reel_interactions')
        .select('liked')
        .then((r) => r),
      supabaseAdmin
        .from('reel_interactions')
        .select('saved')
        .then((r) => r),
      supabaseAdmin
        .from('reel_interactions')
        .select('comment_count')
        .then((r) => r),
    ]);

    if (viewsRes.error) throw viewsRes.error;
    if (likesRes.error) throw likesRes.error;
    if (savesRes.error) throw savesRes.error;
    if (commentsCountRes.error) throw commentsCountRes.error;

    const reels = (viewsRes.data || []) as Array<{ view_count: number | null }>; 
    const likesRows = (likesRes.data || []) as Array<{ liked: boolean }>;
    const savesRows = (savesRes.data || []) as Array<{ saved: boolean }>;
    const interactionCommentsRows = (commentsCountRes.data || []) as Array<{ comment_count: number }>;

    const totalViews = reels.reduce((sum, r) => sum + (r.view_count || 0), 0);
    const totalLikes = likesRows.reduce((sum, r) => sum + (r.liked ? 1 : 0), 0);
    const totalSaves = savesRows.reduce((sum, r) => sum + (r.saved ? 1 : 0), 0);
    const totalComments = interactionCommentsRows.reduce((sum, r) => sum + (r.comment_count || 0), 0);

    // Shares: your schema does not currently track shares.
    // Return 0 for now (and you can later wire it to a reel_shares table or event).
    const totalShares = 0;

    return NextResponse.json({
      success: true,
      data: {
        totalLikes,
        totalViews,
        totalComments,
        totalShares,
        totalSaves,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}

