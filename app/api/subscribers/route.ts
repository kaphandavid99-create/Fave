import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // If the table doesn't exist yet, don't break the whole admin UI.
    let query = supabase
      .from('subscribers')
      .select('id,email,created_at')
      .order('created_at', { ascending: false });

    // Important: some Supabase setups require selecting correct schema/table name.
    // If you still see PGRST205, verify the table exists and is in the 'public' schema.


    if (search) {
      const term = search.trim();
      query = query.ilike('email', `%${term}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

