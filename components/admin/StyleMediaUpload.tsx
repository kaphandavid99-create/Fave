'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Play,
  Image as ImageIcon
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
}

interface StyleMediaUploadProps {
  styleCategory: 'classic-braids' | 'modern-style';
  title: string;
  description: string;
}

export default function StyleMediaUpload({
  styleCategory,
  title,
  description
}: StyleMediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const validateFile = (file: File): boolean => {
    const isVideo = file.type.startsWith('video');
    const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos
    const maxImageSize = 20 * 1024 * 1024; // 20MB for images
    const maxSize = isVideo ? maxVideoSize : maxImageSize;
    const sizeLimitMB = isVideo ? '50MB' : '20MB';
    
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file type. Allowed: Images (JPEG, PNG, WebP, GIF) or Videos (MP4, WebM, MOV, AVI)'
      });
      return false;
    }

    if (file.size > maxSize) {
      setUploadStatus({
        type: 'error',
        message: `File size exceeds ${sizeLimitMB} limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file to upload'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: 'idle', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', `braiding/${styleCategory}`);
      formData.append('resourceType', 'auto');

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      const newMedia: MediaFile = {
        id: Date.now().toString(),
        name: selectedFile.name,
        url: data.url,
        type: selectedFile.type.startsWith('video') ? 'video' : 'image',
        size: selectedFile.size,
        uploadedAt: new Date().toISOString()
      };

      setMediaFiles([newMedia, ...mediaFiles]);
      setUploadStatus({
        type: 'success',
        message: `${selectedFile.name} uploaded successfully!`
      });

      // Reset form
      setSelectedFile(null);
      const fileInput = document.getElementById(`file-input-${styleCategory}`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus({ type: 'idle', message: '' });
      }, 3000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload file'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = (id: string) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-[#3A241C]/10 p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-[#3A241C] mb-2">{title}</h3>
        <p className="text-[#454545]">{description}</p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors p-8 mb-6 ${
          dragActive
            ? 'border-[#8A4A32] bg-[#F7F1EC]'
            : 'border-[#3A241C]/20 bg-[#FFF8E7]/50 hover:border-[#8A4A32]/50'
        }`}
      >
        <input
          id={`file-input-${styleCategory}`}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
          disabled={uploading}
        />

        <div className="text-center">
          <motion.div
            animate={{ scale: dragActive ? 1.1 : 1 }}
            className="inline-block mb-4"
          >
            <Upload className={`size-12 ${dragActive ? 'text-[#8A4A32]' : 'text-[#8A4A32]/50'}`} />
          </motion.div>

          <h4 className="text-lg font-semibold text-[#3A241C] mb-2">
            {selectedFile ? selectedFile.name : 'Drop your files here or click to select'}
          </h4>

          <p className="text-sm text-[#454545] mb-4">
            Supports images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV, AVI)
          </p>

          <p className="text-xs text-[#8A4A32] font-semibold mb-4">
            Maximum file size: 50MB (videos), 20MB (images)
          </p>

          <button
            onClick={() => document.getElementById(`file-input-${styleCategory}`)?.click()}
            disabled={uploading}
            className="px-6 py-2 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition disabled:opacity-50"
          >
            Choose File
          </button>
        </div>
      </div>

      {/* Selected File Info and Upload Button */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#F7F1EC] rounded-xl p-4 mb-6 border border-[#3A241C]/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {selectedFile.type.startsWith('video') ? (
                  <Play className="text-[#8A4A32]" size={24} />
                ) : (
                  <ImageIcon className="text-[#8A4A32]" size={24} />
                )}
                <div className="text-left">
                  <p className="font-semibold text-[#3A241C]">{selectedFile.name}</p>
                  <p className="text-xs text-[#454545]">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  const fileInput = document.getElementById(`file-input-${styleCategory}`) as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                disabled={uploading}
                className="p-2 hover:bg-white rounded-lg transition disabled:opacity-50"
              >
                <X className="text-[#454545]" size={20} />
              </button>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="animate-spin text-[#8A4A32]" size={16} />
                  <p className="text-sm font-medium text-[#3A241C]">{Math.round(uploadProgress)}%</p>
                </div>
                <div className="w-full bg-[#3A241C]/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-gradient-to-r from-[#8A4A32] to-[#D4A574] h-2 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                uploading
                  ? 'bg-[#8A4A32]/50 text-white cursor-not-allowed'
                  : 'bg-[#8A4A32] text-white hover:bg-[#6A3A22]'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Media
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {uploadStatus.type !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p className={uploadStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {uploadStatus.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Media Grid */}
      {mediaFiles.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-[#3A241C] mb-4">
            Uploaded Media ({mediaFiles.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg overflow-hidden bg-[#F7F1EC] border border-[#3A241C]/10 group"
              >
                {/* Media Preview */}
                <div className="relative aspect-video bg-black/10">
                  {file.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#3A241C]">
                      <Play className="text-white" size={32} />
                    </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                      }}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                    {file.type === 'video' && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                      >
                        <Play className="text-[#3A241C]" size={20} />
                      </a>
                    )}
                    <button
                      onClick={() => handleRemove(file.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="text-white" size={20} />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-[#3A241C] truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-[#454545]">{formatFileSize(file.size)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
