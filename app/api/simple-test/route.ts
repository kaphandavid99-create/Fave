import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('=== SIMPLE VIDEOS TEST ===');
    
    // Simple test to see if we can query the videos table
    const { data, error } = await supabase
      .from('videos')
      .select('id, video_url, description, is_featured')
      .limit(1);

    if (error) {
      console.error('Simple videos test failed:', error);
      return NextResponse.json({ 
        status: 'error',
        message: 'Cannot access videos table',
        error: error.message,
        hint: 'Run: pejah/migrate-database.sql in Supabase SQL Editor'
      });
    }

    return NextResponse.json({ 
      status: 'success',
      message: 'Videos table is accessible',
      videoCount: data?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}