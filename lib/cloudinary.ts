import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary environment variables not set. Cloudinary features will not work.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Helper to convert a File to a Node.js Readable stream.
 * This is more memory-efficient than base64 for large files (e.g., videos up to 50MB).
 */
function fileToStream(file: File): Readable {
  const readable = new Readable({
    async read() {
      const buffer = await file.arrayBuffer();
      this.push(Buffer.from(buffer));
      this.push(null);
    },
  });
  return readable;
}

/**
 * Helper function to upload image or video to Cloudinary.
 * Uses upload_stream for better memory handling of large files.
 */
export async function uploadImage(file: File, folder: string = 'hair-braiding', resourceType: string = 'auto') {
  try {
    // Determine actual resource type from file MIME type if not explicitly provided
    const detectedType = file.type.startsWith('video') ? 'video' : 
                         file.type.startsWith('image') ? 'image' : resourceType;

    const uploadOptions: any = {
      folder: folder,
      resource_type: detectedType,
      timeout: 120000, // 2 minute timeout for large uploads
    };

    // Video-specific optimizations for browser compatibility
    if (detectedType === 'video') {
      uploadOptions.eager = [
        { format: 'mp4', quality: '70' },
      ];
      uploadOptions.eager_async = false; // Apply synchronously so returned URL is ready
      uploadOptions.chunk_size = 6000000; // 6MB chunks for streaming upload
    }

    // Use upload_stream for better memory efficiency than base64 data URI
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the file stream to Cloudinary
      const fileStream = fileToStream(file);
      fileStream.pipe(uploadStream);

      fileStream.on('error', (err) => {
        reject(err);
      });
    });

    // For videos, use the eager transformed URL (MP4) for browser compatibility
    let videoUrl = result.secure_url;
    if (detectedType === 'video') {
      // If eager transformation was applied, use the transformed URL
      if (result.eager && result.eager.length > 0 && result.eager[0].secure_url) {
        videoUrl = result.eager[0].secure_url;
      } else if (!videoUrl.includes('/f_mp4')) {
        // Fallback: manually add MP4 format transformation
        videoUrl = videoUrl.replace('/upload/', '/upload/f_mp4,q_70/');
      }
    }

    return {
      url: videoUrl,
      publicId: result.public_id,
      width: result.width || 0,
      height: result.height || 0,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    console.error('File type:', file.type, 'File size:', file.size);
    throw new Error('Failed to upload file');
  }
}

// Helper function to delete image
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}
