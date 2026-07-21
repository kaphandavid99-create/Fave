import { NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { inMemoryStorage } from '@/lib/in-memory-storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'hair-braiding';
    const resourceType = formData.get('resourceType') as string || 'auto';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size based on type
    const isVideo = file.type.startsWith('video');
    const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos
    const maxImageSize = 10 * 1024 * 1024; // 10MB for images
    const maxSize = isVideo ? maxVideoSize : maxImageSize;
    const sizeLimitMB = isVideo ? '50MB' : '10MB';
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `${isVideo ? 'Video' : 'Image'} size exceeds ${sizeLimitMB} limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/mov',
      'video/avi'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, MP4, WebM, MOV, AVI' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary with proper resource type
    const result = await uploadImage(file, folder, resourceType);

    // Store in database
    const { error: dbError } = await supabase
      .from('media')
      .insert({
        public_id: result.publicId,
        url: result.url,
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        size: file.size,
        width: result.width,
        height: result.height,
        folder: folder
      });

    if (dbError) {
      console.error('Database insert error, using in-memory fallback:', dbError);
      // Fallback to in-memory storage
      inMemoryStorage.media.push({
        id: Date.now().toString(),
        url: result.url,
        publicId: result.publicId,
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        size: file.size,
        width: result.width,
        height: result.height,
        folder: folder,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      resourceType: result.resourceType || (file.type.startsWith('video') ? 'video' : 'image'),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await deleteImage(publicId);

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('public_id', publicId);

    if (dbError) {
      console.error('Database delete error, using fallback:', dbError);
      // Fallback to in-memory deletion
      inMemoryStorage.media = inMemoryStorage.media.filter((item: any) => item.publicId !== publicId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
