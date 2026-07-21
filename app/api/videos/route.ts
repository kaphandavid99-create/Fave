import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types/video';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    console.log('=== FETCHING VIDEOS ===');
    console.log('Featured filter:', featured);
    
    let query = supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching videos:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      throw error;
    }

    console.log('Videos fetched successfully:', data?.length || 0);
    return NextResponse.json({ data: data as Video[] });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos', 
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please run the database migration script'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const videoData = await request.json();

    console.log('=== VIDEO CREATION DEBUG ===');
    console.log('Received video data:', JSON.stringify(videoData, null, 2));

    // Validate required fields
    if (!videoData.video_url) {
      console.error('Missing video_url in request data');
      return NextResponse.json(
        { error: 'Video URL is required', suggestion: 'Please upload a video first' },
        { status: 400 }
      );
    }

    console.log('Video URL present:', videoData.video_url);
    
    // First check if the videos table exists
    console.log('Checking if videos table exists...');
    const { error: tableCheckError } = await supabase
      .from('videos')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Videos table does not exist:', tableCheckError);
      return NextResponse.json(
        { 
          error: 'Videos table does not exist in database',
          suggestion: 'Please run the database migration script: pejah/migrate-database.sql',
          details: tableCheckError.message
        },
        { status: 500 }
      );
    }

    console.log('Videos table exists');

    // Create video data with default values
    const newVideo: any = {
      video_url: videoData.video_url,
      video_public_id: videoData.video_public_id || null,
      description: videoData.description || null,
      is_featured: videoData.is_featured || false,
      display_order: videoData.display_order || 0,
    };

    console.log('Creating video with data:', JSON.stringify(newVideo, null, 2));

    const { data, error } = await supabase
      .from('videos')
      .insert([newVideo])
      .select()
      .single();

    if (error) {
      console.error('Supabase error during video creation:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      throw error;
    }

    console.log('Video created successfully:', data);
    return NextResponse.json({ data: data as Video }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    console.error('Error type:', typeof error);
    console.error('Error instanceof Error:', error instanceof Error);
    
    let errorMessage = 'Unknown error';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { message: error.message, stack: error.stack };
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
      errorDetails = error;
      console.error('Error object:', error);
    } else {
      errorMessage = String(error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create video', 
        details: errorMessage,
        errorDetails: errorDetails,
        suggestion: 'Make sure you ran the database migration script in Supabase SQL Editor'
      },
      { status: 500 }
    );
  }
}