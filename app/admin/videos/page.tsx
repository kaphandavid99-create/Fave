'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Video,
  Trash2,
  Edit,
  Star,
  Loader2,
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Video {
  id: string;
  video_url: string;
  video_public_id: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<{exists: boolean, message: string} | null>(null);

  useEffect(() => {
    checkDatabaseStatus();
    fetchVideos();
  }, []);

  const checkDatabaseStatus = async () => {
    try {

      const response = await fetch('/api/simple-test');
      const result = await response.json();
      
      setDbStatus(result);
      
      if (result.status === 'error') {
        setError(result.message + '. Please run the database migration script.');
      }
    } catch (err) {
      console.error('Database status check failed:', err);
      setDbStatus({ exists: false, message: 'Failed to check database status' });
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch videos');
      }

      setVideos(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      await fetchVideos();
    } catch (err) {
      alert('Failed to delete video');
    }
  };

  const handleFormSubmit = async (formData: {
    video_url: string;
    video_public_id: string | null;
    description: string | null;
    is_featured: boolean;
    display_order: number;
  }) => {

    try {
      console.log('=== ADMIN VIDEO FORM SUBMISSION ===');
      console.log('Form data:', formData);

      // Check database status first
      const statusResponse = await fetch('/api/simple-test');
      const statusResult = await statusResponse.json();
      
      console.log('Database status check:', statusResult);
      
      if (statusResult.status === 'error') {
        alert(`Database not set up: ${statusResult.message}\n\nPlease run the migration script: pejah/migrate-database-simple.sql`);
        return;
      }

      const url = editingVideo 
        ? `/api/videos/${editingVideo.id}`
        : '/api/videos';
      
      const method = editingVideo ? 'PUT' : 'POST';

      console.log(`Sending ${method} request to: ${url}`);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        console.error('API Error details:', result);
        const errorMessage = result.error || result.details || 'Unknown API error';
        throw new Error(`${editingVideo ? 'Failed to update video' : 'Failed to create video'}: ${errorMessage}`);
      }

      await fetchVideos();
      setShowForm(false);
      setEditingVideo(null);
    } catch (err) {
      console.error('Form submission error:', err);
      alert(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#8A4A32] size-8" />
      </div>
    );
  }

  if (dbStatus && !dbStatus.exists) {

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <Video className="text-red-500 size-12 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-red-800 mb-2">Database Not Set Up</h2>
          <p className="text-red-700 mb-4">{dbStatus.message}</p>
          <div className="bg-red-100 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-red-800 mb-2">To fix this:</h3>
            <ol className="list-decimal list-inside text-red-700 space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Open SQL Editor</li>
              <li>Run the script: pejah/migrate-database.sql</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (dbStatus && dbStatus.exists === true) {
    // Even if DB exists, fetching videos can still fail (RLS/auth). Show fetch errors clearly.
    if (error) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-lg font-serif text-red-800 mb-2">Failed to load videos</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchVideos();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
  }

  if (error && !dbStatus) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchVideos();
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif text-[#3A241C] mb-2">Video Showcase</h1>
          <p className="text-[#454545]">Manage your video gallery with descriptions</p>
        </div>
        <button 
          onClick={() => {
            setEditingVideo(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-xl hover:bg-[#6A3A22] transition font-medium shadow-lg"
        >
          <Plus size={20} />
          Add Video
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
          <input
            type="text"
            placeholder="Search videos by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#3A241C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#3A241C]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Total Videos</p>
              <p className="text-3xl font-bold text-[#3A241C]">{videos.length}</p>
            </div>
            <Video className="text-[#8A4A32]" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#3A241C]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Featured</p>
              <p className="text-3xl font-bold text-[#8A4A32]">{videos.filter(v => v.is_featured).length}</p>
            </div>
            <Star className="text-[#8A4A32]" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#3A241C]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">With Description</p>
              <p className="text-3xl font-bold text-[#3A241C]">{videos.filter(v => v.description).length}</p>
            </div>
            <Play className="text-[#8A4A32]" size={32} />
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-[#3A241C]/10 overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-[#F7F1EC]">
              <video
                src={formatVideoUrl(video.video_url)}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => {
                  try {
                    e.currentTarget.play().catch(err => console.error(err));
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onMouseLeave={(e) => {
                  try {
                    e.currentTarget.pause();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {video.is_featured && (
                  <span className="px-3 py-1 bg-[#8A4A32] text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Star size={12} />
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingVideo(video);
                    setShowForm(true);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm text-[#3A241C] rounded-full hover:bg-white transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm text-[#3A241C] px-3 py-1 rounded-full text-xs font-medium">
                  {video.display_order || 0}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6">
              <p className="text-sm text-[#454545] line-clamp-2 min-h-[2.5rem]">
                {video.description || 'No description'}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3A241C]/10">
                <span className="text-xs text-[#8A4A32]">
                  {new Date(video.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  {video.is_featured && <Star size={14} className="text-[#8A4A32]" />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Video Form Modal */}
      <AnimatePresence>
        {showForm && (
          <VideoForm
            video={editingVideo}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingVideo(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoForm({
  video,
  onSubmit,
  onCancel,
}: {
  video: Video | null;
  onSubmit: (data: {
    video_url: string;
    video_public_id: string | null;
    description: string | null;
    is_featured: boolean;
    display_order: number;
  }) => void;
  onCancel: () => void;
}) {

  const [videoUrl, setVideoUrl] = useState(video?.video_url || '');
  const [videoPublicId, setVideoPublicId] = useState(video?.video_public_id || '');
  const [description, setDescription] = useState(video?.description || '');
  const [isFeatured, setIsFeatured] = useState(video?.is_featured || false);
  const [displayOrder, setDisplayOrder] = useState(video?.display_order || 0);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'videos');
      formData.append('resourceType', 'video');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setVideoUrl(result.url);
      setVideoPublicId(result.publicId || '');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== VIDEO FORM SUBMIT ===');
    console.log('Video URL:', videoUrl);
    console.log('Video Public ID:', videoPublicId);
    console.log('Description:', description);
    console.log('Is Featured:', isFeatured);
    console.log('Display Order:', displayOrder);
    
    if (!videoUrl) {
      alert('Please upload a video');
      return;
    }

    const submitData: any = {
      video_url: videoUrl,
      video_public_id: videoPublicId || null,
      description: description || null,
      is_featured: isFeatured,
      display_order: parseInt(String(displayOrder)),
    };

    console.log('Submitting data:', submitData);
    onSubmit(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#3A241C]/10 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#3A241C]">
            {video ? 'Edit Video' : 'Add New Video'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-3">
              Video *
            </label>
            
            <div className="border-2 border-dashed border-[#3A241C]/20 rounded-2xl p-8 text-center hover:border-[#8A4A32] transition">
              {videoUrl ? (
                <div className="relative">
                  <video
                    src={formatVideoUrl(videoUrl)}
                    className="w-full max-h-64 mx-auto rounded-xl"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('');
                      setVideoPublicId('');
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="p-4 bg-[#F7F1EC] rounded-full mb-3">
                      {uploading ? (
                        <Loader2 className="animate-spin text-[#8A4A32] size-8" />
                      ) : (
                        <Video className="text-[#8A4A32] size-8" />
                      )}
                    </div>
                    <p className="text-sm text-[#454545] font-medium">
                      {uploading ? 'Uploading video...' : 'Click to upload video'}
                    </p>
                    <p className="text-xs text-[#8A4A32] mt-2">Max size: 50MB • MP4, WebM, MOV</p>
                  </label>
                </div>
              )}
            </div>
            
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description..."
              rows={4}
              className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50 resize-none"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              placeholder="0 = first"
              className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-[#3A241C]/20 text-[#8A4A32] focus:ring-[#8A4A32]"
            />
            <label htmlFor="featured" className="text-sm text-[#454545]">
              Featured video
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#3A241C]/10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-[#3A241C]/20 rounded-xl hover:bg-[#F7F1EC] transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#8A4A32] text-white rounded-xl hover:bg-[#6A3A22] transition font-medium"
            >
              {video ? 'Update Video' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function formatVideoUrl(videoUrl: string): string {
  if (!videoUrl) return videoUrl;
  
  if (videoUrl.includes('/f_') || videoUrl.includes('/q_')) {
    return videoUrl;
  }
  
  if (videoUrl.includes('/upload/')) {
    return videoUrl.replace('/upload/', '/upload/f_mp4,q_70/');
  }
  
  return videoUrl;
}