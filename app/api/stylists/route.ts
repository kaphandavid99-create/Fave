import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Stylist } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = supabase
      .from('stylists')
      .select('*')
      .order('name');
    
    if (active === 'true') {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: data as Stylist[] });
  } catch (error) {
    console.error('Error fetching stylists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stylists' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const stylistData = await request.json();

    const { data, error } = await supabase
      .from('stylists')
      .insert([stylistData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: data as Stylist }, { status: 201 });
  } catch (error) {
    console.error('Error creating stylist:', error);
    return NextResponse.json(
      { error: 'Failed to create stylist' },
      { status: 500 }
    );
  }
}
