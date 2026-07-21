import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { inMemoryStorage } from '@/lib/in-memory-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'image' or 'video'

    let query = supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media items:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Fallback to in-memory storage if database table doesn't exist
      console.log('Database not set up, using in-memory storage');
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      let filteredMedia = inMemoryStorage.media;
      if (type && type !== 'all') {
        filteredMedia = filteredMedia.filter((item: any) => item.type === type);
      }
      
      const transformedMedia = filteredMedia.map((item: any) => ({
        ...item,
        url: item.url?.startsWith('/') ? `${baseUrl}${item.url}` : item.url
      }));
      
      return NextResponse.json({
        success: true,
        data: transformedMedia,
        total: transformedMedia.length,
        usingFallback: true
      });
    }

    // Transform data to match expected format
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const mediaItems = data?.map((item: any) => ({
      id: item.id,
      url: item.url?.startsWith('/') ? `${baseUrl}${item.url}` : item.url,
      publicId: item.public_id,
      name: item.name,
      type: item.type,
      size: item.size,
      width: item.width,
      height: item.height,
      folder: item.folder,
      createdAt: item.created_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: mediaItems,
      total: mediaItems.length
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    
    // Fallback to in-memory storage
    console.log('Database error, using in-memory storage');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const transformedMedia = inMemoryStorage.media.map((item: any) => ({
      ...item,
      url: item.url?.startsWith('/') ? `${baseUrl}${item.url}` : item.url
    }));
    return NextResponse.json({
      success: true,
      data: transformedMedia,
      total: transformedMedia.length,
      usingFallback: true
    });
  }
}