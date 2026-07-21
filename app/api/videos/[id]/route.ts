import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types/video';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data as Video });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
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
    const videoData = await request.json();

    console.log('=== VIDEO UPDATE DEBUG ===');
    console.log('Updating video:', id, 'with data:', videoData);

    // Allowed columns for update
    const allowedColumns = [
      'video_url', 'video_public_id', 'description', 
      'is_featured', 'display_order'
    ];

    const filteredData = Object.entries(videoData).reduce((acc: any, [key, value]) => {
      if (allowedColumns.includes(key) && value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Updating video with filtered data:', filteredData);

    const { data, error } = await supabase
      .from('videos')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    console.log('Video updated successfully:', data);
    return NextResponse.json({ data: data as Video });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video', details: error instanceof Error ? error.message : 'Unknown error' },
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

    // First get the video to delete from Cloudinary
    const { data: video } = await supabase
      .from('videos')
      .select('video_public_id')
      .eq('id', id)
      .single();

    // Delete from Cloudinary if public_id exists
    if (video?.video_public_id) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: video.video_public_id }),
        });
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}