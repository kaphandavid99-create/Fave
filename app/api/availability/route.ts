import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Availability } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stylistId = searchParams.get('stylist_id');

    let query = supabase.from('availability').select('*');

    if (stylistId) {
      query = query.eq('stylist_id', stylistId);
    }

    const { data, error } = await query
      .eq('is_available', true)
      .order('day_of_week', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data as Availability[] });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
