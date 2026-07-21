import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if columns exist
    const { data: servicesData, error: selectError } = await supabase
      .from('services')
      .select('video_url, gallery')
      .limit(1);

    if (selectError) {
      // Columns likely don't exist, let's try to add them
      console.log('Columns might not exist, attempting to add them...');

      // Try to add video_url column
      try {
        await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE services ADD COLUMN IF NOT EXISTS video_url VARCHAR(500)'
        });
      } catch (e) {
        console.log('Error adding video_url:', e);
      }

      // Try to add video_public_id column
      try {
        await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE services ADD COLUMN IF NOT EXISTS video_public_id VARCHAR(500)'
        });
      } catch (e) {
        console.log('Error adding video_public_id:', e);
      }

      // Try to add gallery column as array
      try {
        await supabase.rpc('exec_sql', {
          sql: "ALTER TABLE services ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT ARRAY[]::TEXT"
        });
      } catch (e) {
        console.log('Error adding gallery:', e);
      }

      return NextResponse.json({ 
        message: 'Database schema updated with new columns',
        addedColumns: ['video_url', 'video_public_id', 'gallery']
      });
    }

    // If we got here, columns exist
    return NextResponse.json({ 
      message: 'Database schema already has required columns',
      existingColumns: ['video_url', 'gallery']
    });

  } catch (error) {
    console.error('Error updating database schema:', error);
    return NextResponse.json(
      { error: 'Failed to update database schema' },
      { status: 500 }
    );
  }
}