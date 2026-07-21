import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('=== TESTING VIDEOS TABLE ===');
    
    // Test 1: Check if videos table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('videos')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Videos table does not exist or error:', tableError);
      return NextResponse.json({ 
        status: 'error',
        message: 'Videos table does not exist',
        error: tableError.message,
        suggestion: 'Please run the database migration script: pejah/migrate-database.sql'
      });
    }

    console.log('Videos table exists, found', tableExists?.length || 0, 'videos');

    // Test 2: Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('videos')
      .select('*')
      .limit(0);

    if (columnsError) {
      console.error('Error checking videos table structure:', columnsError);
      return NextResponse.json({ 
        status: 'error',
        message: 'Error checking videos table structure',
        error: columnsError.message
      });
    }

    console.log('Videos table structure is OK');

    return NextResponse.json({ 
      status: 'success',
      message: 'Videos table exists and is accessible',
      videoCount: tableExists?.length || 0
    });

  } catch (error) {
    console.error('Videos test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Unexpected error during videos test',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}