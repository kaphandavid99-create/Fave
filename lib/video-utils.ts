// Client-safe utility functions for video handling

/**
 * Format video URL for HTML5 video compatibility
 * This function can be used in both client and server components
 */
export function formatVideoUrl(videoUrl: string | null): string {
  if (!videoUrl) return '';
  
  // If URL already has transformations, keep it as is
  if (videoUrl.includes('/f_') || videoUrl.includes('/q_')) {
    return videoUrl;
  }
  
  // Add MP4 format transformation for browser compatibility
  if (videoUrl.includes('/upload/')) {
    return videoUrl.replace('/upload/', '/upload/f_mp4,q_70/');
  }
  
  return videoUrl;
}

/**
 * Check if a URL is a video URL
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || 
         url.includes('/video/') ||
         url.includes('video');
}