'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Video, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface ServiceFormProps {
  service?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    category: service?.category || '',
    is_featured: service?.is_featured || false,
  });

  const [imageUrl, setImageUrl] = useState(service?.image_url || '');
  const [imagePublicId, setImagePublicId] = useState(service?.cloudinary_public_id || '');
  const [videoUrl, setVideoUrl] = useState(service?.video_url || '');
  const [videoPublicId, setVideoPublicId] = useState(service?.video_public_id || '');
  const [gallery, setGallery] = useState<string[]>(service?.gallery || []);
  const [galleryPublicIds, setGalleryPublicIds] = useState<{url: string, publicId: string}[]>(
    service?.gallery && service?.gallery_public_ids 
      ? service.gallery.map((url: string, index: number) => ({
          url,
          publicId: service.gallery_public_ids[index] || ''
        }))
      : service?.gallery?.map((url: string) => ({ url, publicId: '' })) || []
  );
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video' | 'gallery'>('image');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size based on type
    const isVideo = file.type.startsWith('video');
    const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos
    const maxImageSize = 10 * 1024 * 1024; // 10MB for images
    
    if (isVideo && file.size > maxVideoSize) {
      setUploadError(`Video size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }
    
    if (!isVideo && file.size > maxImageSize) {
      setUploadError(`Image size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'services');
      formData.append('resourceType', type === 'video' ? 'video' : 'image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      console.log('Upload result:', result);

      if (type === 'image') {
        setImageUrl(result.url);
        setImagePublicId(result.publicId || '');
      } else if (type === 'video') {
        setVideoUrl(result.url);
        setVideoPublicId(result.publicId || '');
        console.log('Video uploaded:', { url: result.url, publicId: result.publicId });
      } else if (type === 'gallery') {
        setGallery([...gallery, result.url]);
        setGalleryPublicIds([...galleryPublicIds, { url: result.url, publicId: result.publicId || '' }]);
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFromGallery = (index: number) => {
    const item = galleryPublicIds[index];
    if (item?.publicId) {
      // Delete from Cloudinary
      fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: item.publicId }),
      }).catch(console.error);
    }
    setGallery(gallery.filter((_, i) => i !== index));
    setGalleryPublicIds(galleryPublicIds.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async () => {
    if (imagePublicId) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: imagePublicId }),
        });
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    setImageUrl('');
    setImagePublicId('');
  };

  const handleDeleteVideo = async () => {
    if (videoPublicId) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: videoPublicId }),
        });
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
    setVideoUrl('');
    setVideoPublicId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      image_url: imageUrl || null,
    };

    // Handle main image and its public ID
    if (imageUrl) {
      submitData.image_url = imageUrl;
      if (imagePublicId) {
        submitData.cloudinary_public_id = imagePublicId;
      }
    } else {
      // If image is cleared, also clear the public ID
      submitData.cloudinary_public_id = null;
    }

    // Handle video and its public ID
    if (videoUrl) {
      submitData.video_url = videoUrl;
      if (videoPublicId) {
        submitData.video_public_id = videoPublicId;
      }
    } else {
      // If video is cleared, also clear the public ID
      submitData.video_public_id = null;
    }

    // Handle gallery and its public IDs
    if (gallery && gallery.length > 0) {
      submitData.gallery = gallery;
      if (galleryPublicIds.length > 0) {
        submitData.gallery_public_ids = galleryPublicIds.map(item => item.publicId);
      }
    } else {
      // If gallery is cleared, also clear the public IDs
      submitData.gallery_public_ids = null;
    }

    console.log('Submitting service data:', submitData);
    onSubmit(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#3A241C]/10 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#3A241C]">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Media Upload Section */}
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-3">
              Media
            </label>
            
            {/* Upload Type Tabs */}
            <div className="flex gap-2 mb-4 border-b border-[#3A241C]/10">
              <button
                type="button"
                onClick={() => setUploadType('image')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  uploadType === 'image'
                    ? 'text-[#8A4A32] border-b-2 border-[#8A4A32]'
                    : 'text-[#454545] hover:text-[#8A4A32]'
                }`}
              >
                Main Image
              </button>
              <button
                type="button"
                onClick={() => setUploadType('video')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  uploadType === 'video'
                    ? 'text-[#8A4A32] border-b-2 border-[#8A4A32]'
                    : 'text-[#454545] hover:text-[#8A4A32]'
                }`}
              >
                Video
              </button>
              <button
                type="button"
                onClick={() => setUploadType('gallery')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  uploadType === 'gallery'
                    ? 'text-[#8A4A32] border-b-2 border-[#8A4A32]'
                    : 'text-[#454545] hover:text-[#8A4A32]'
                }`}
              >
                Gallery
              </button>
            </div>

            {/* Main Image Upload */}
            {uploadType === 'image' && (
              <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-6 text-center hover:border-[#8A4A32] transition">
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Service preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="p-4 bg-[#F7F1EC] rounded-full mb-2">
                        {uploading ? (
                          <Loader2 className="animate-spin text-[#8A4A32] size-6" />
                        ) : (
                          <ImageIcon className="text-[#8A4A32] size-6" />
                        )}
                      </div>
                      <p className="text-sm text-[#454545]">
                        {uploading ? 'Uploading...' : 'Click to upload main image'}
                      </p>
                      <p className="text-xs text-[#8A4A32] mt-1">Max size: 10MB • Recommended: 800x600px</p>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Video Upload */}
            {uploadType === 'video' && (
              <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-6 text-center hover:border-[#8A4A32] transition">
                {videoUrl ? (
                  <div className="relative">
                    <video
                      src={videoUrl}
                      controls
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteVideo}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
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
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="p-4 bg-[#F7F1EC] rounded-full mb-2">
                        {uploading ? (
                          <Loader2 className="animate-spin text-[#8A4A32] size-6" />
                        ) : (
                          <Video className="text-[#8A4A32] size-6" />
                        )}
                      </div>
                      <p className="text-sm text-[#454545]">
                        {uploading ? 'Uploading...' : 'Click to upload video'}
                      </p>
                      <p className="text-xs text-[#8A4A32] mt-1">Max size: 50MB</p>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Upload */}
            {uploadType === 'gallery' && (
              <div>
                <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-6 text-center hover:border-[#8A4A32] transition mb-4">
                  <input
                    type="file"
                    id="gallery-upload"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(e, 'gallery');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="p-4 bg-[#F7F1EC] rounded-full mb-2">
                      {uploading ? (
                        <Loader2 className="animate-spin text-[#8A4A32] size-6" />
                      ) : (
                        <Plus className="text-[#8A4A32] size-6" />
                      )}
                    </div>
                    <p className="text-sm text-[#454545]">
                      {uploading ? 'Uploading...' : 'Add images to gallery'}
                    </p>
                    <p className="text-xs text-[#8A4A32] mt-1">Max size: 10MB per image • Upload multiple images</p>
                  </label>
                </div>

                {/* Gallery Preview */}
                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    <AnimatePresence>
                      {gallery.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative aspect-square"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromGallery(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
            {uploadSuccess && (
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <CheckCircle size={14} /> Upload successful
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="e.g., Goddess Knotless"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Price (XAF) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="180"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              >
                <option value="">Select category</option>
                <option value="Signature Series">Signature Series</option>
                <option value="Artistic Edition">Artistic Edition</option>
                <option value="Heritage Modern">Heritage Modern</option>
                <option value="Custom">Custom</option>
                <option value="Classic">Classic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="Describe this service..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-[#8A4A32] border-[#3A241C]/30 rounded focus:ring-2 focus:ring-[#8A4A32]"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-[#454545]">
                Featured Service
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#3A241C]/10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-[#3A241C]/20 rounded-lg hover:bg-[#F7F1EC] transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
            >
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}