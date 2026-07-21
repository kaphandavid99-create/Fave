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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_path, session_id, clerk_user_id, referrer, user_agent, ip_address } = body;

    if (!page_path || !session_id) {
      return NextResponse.json(
        { success: false, error: 'page_path and session_id are required' },
        { status: 400 }
      );
    }

    // Insert the page visit
    const { error } = await supabaseAdmin.from('page_visits').insert({
      page_path,
      session_id,
      clerk_user_id: clerk_user_id || null,
      referrer: referrer || null,
      user_agent: user_agent || null,
      ip_address: ip_address || null,
    });

    if (error) {
      console.error('Error tracking page visit:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to track page visit' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Error in visit tracking:', e);
    return NextResponse.json(
      {
        success: false,
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
