import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getClerkUserId } from '@/lib/clerk-server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Use service role for admin operations to bypass RLS
const supabaseAdmin = createClient(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const reels = (data || []).map((r: any) => ({
      id: r.id,
      videoUrl: r.video_url,
      description: r.description,
      viewCount: r.view_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({ success: true, data: reels });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting reel upload...');
    
    const clerkUserId = await getClerkUserId();
    if (!clerkUserId) {
      console.log('Unauthorized upload attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const description = formData.get('description') as string | null;

    console.log('Video file:', videoFile?.name, videoFile?.size, videoFile?.type);

    if (!videoFile) {
      return NextResponse.json({ success: false, error: 'Missing video file' }, { status: 400 });
    }

    // Check file size (max 50MB for reliability)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (videoFile.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: `File too large. Maximum size is 50MB. Your file is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB.` 
      }, { status: 400 });
    }

    const videoPublicId: string | null = null;
    let videoUrl = '';



    // Use local storage only for reliability
    console.log('Using local storage...');
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'reels');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Directory might already exist, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadsDir, filename);

    console.log('Converting and saving file...');
    // Convert file to buffer and save
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    console.log('File saved locally:', filepath);

    // Create public URL for the video
    videoUrl = `/uploads/reels/${filename}`;



    console.log('Saving to database...');

    const { data, error } = await supabaseAdmin
      .from('reels')
      .insert({
        video_url: videoUrl,
        video_public_id: videoPublicId,
        description: description || null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 });
    }

    console.log('Reel saved successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error('Upload error:', e);

    const errorMessage = e?.message || String(e);


    return NextResponse.json({ success: false, error: `Upload failed: ${errorMessage}` }, { status: 500 });
  }
}

