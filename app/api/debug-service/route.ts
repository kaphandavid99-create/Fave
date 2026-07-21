import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      // If no ID, return all services with video URLs
      const { data, error } = await supabase
        .from('services')
        .select('id, name, video_url, image_url')
        .not('video_url', 'is', null);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        servicesWithVideos: data,
        count: data?.length || 0
      });
    }

    console.log('=== DEBUGGING SERVICE ===');
    console.log('Service ID:', serviceId);

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Service data:', JSON.stringify(data, null, 2));

    // Check if video URL is properly formatted
    let videoUrlAnalysis = null;
    if (data.video_url) {
      videoUrlAnalysis = {
        url: data.video_url,
        startsWithHttps: data.video_url.startsWith('https://'),
        containsCloudinary: data.video_url.includes('cloudinary'),
        containsVideo: data.video_url.includes('/video/'),
        length: data.video_url.length,
        first50Chars: data.video_url.substring(0, 50),
      };
    }

    return NextResponse.json({ 
      service: data,
      hasVideo: !!data.video_url,
      hasImage: !!data.image_url,
      videoUrl: data.video_url,
      imageUrl: data.image_url,
      videoUrlAnalysis
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}