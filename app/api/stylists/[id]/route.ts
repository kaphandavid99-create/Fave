import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Stylist } from '@/types/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('stylists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Stylist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data as Stylist });
  } catch (error) {
    console.error('Error fetching stylist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stylist' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stylistData = await request.json();

    const { data, error } = await supabase
      .from('stylists')
      .update(stylistData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Stylist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data as Stylist });
  } catch (error) {
    console.error('Error updating stylist:', error);
    return NextResponse.json(
      { error: 'Failed to update stylist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('stylists')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stylist:', error);
    return NextResponse.json(
      { error: 'Failed to delete stylist' },
      { status: 500 }
    );
  }
}
