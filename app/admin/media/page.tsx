'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Trash2, 
  Image as ImageIcon, 
  Video,
  Loader2,
  CheckCircle,
  X,
  Download
} from 'lucide-react';

export default function MediaPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      const uploadedFiles: any[] = [];

      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'media-gallery');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          uploadedFiles.push({
            url: result.url,
            publicId: result.publicId,
            name: file.name,
            type: file.type.startsWith('video') ? 'video' : 'image',
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        }

        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      // Reload media items from database after all uploads complete
      await loadRecentUploads();

      // Clear local state and rely on database
      setRecentUploads([]);
      setSelectedFiles(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        setRecentUploads(recentUploads.filter(file => file.publicId !== publicId));
        // Reload media items from database
        loadRecentUploads();
      }
    } catch (error) {
      alert('Failed to delete file');
    }
  };

  const loadRecentUploads = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      
      if (data.success) {
        setRecentUploads(data.data || []);
        console.log('Loaded media items:', data.data?.length);
        setUsingFallback(data.usingFallback || false);
      } else {
        console.error('Failed to load media:', data.error);
      }
    } catch (error) {
      console.error('Error loading recent uploads:', error);
    }
  };

  useEffect(() => {
    loadRecentUploads();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Media Library</h1>
        <p className="text-[#454545]">Manage images and videos for your website</p>
        {usingFallback && (
          <div className="mt-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Using in-memory storage. Run the SQL schema in Supabase to enable database persistence.
              See <code className="bg-yellow-100 px-1 rounded">/lib/database/media-schema.sql</code>
            </p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6"
      >
        <h2 className="text-xl font-serif text-[#3A241C] mb-4">Upload New Media</h2>
        
        <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-8 text-center hover:border-[#8A4A32] transition">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="p-4 bg-[#F7F1EC] rounded-full mb-4">
              {uploading ? (
                <Loader2 className="animate-spin text-[#8A4A32] size-8" />
              ) : (
                <Upload className="text-[#8A4A32] size-8" />
              )}
            </div>
            <p className="text-lg font-medium text-[#3A241C]">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-[#454545] mt-2">
              Images (JPEG, PNG, WebP, GIF) and Videos (MP4, WebM, MOV, AVI)
            </p>
            <p className="text-xs text-[#8A4A32] mt-1">Max file size: 10MB each</p>
          </label>
        </div>

        {selectedFiles && selectedFiles.length > 0 && !uploading && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-[#454545]">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected:
            </p>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#F7F1EC]/50 rounded">
                <span className="text-sm text-[#454545]">{file.name}</span>
                <span className="text-xs text-[#8A4A32]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ))}
            <button
              onClick={handleUpload}
              className="mt-4 w-full py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
            >
              Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#8A4A32] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-[#454545] mt-2 text-center">{uploadProgress.toFixed(0)}% complete</p>
          </div>
        )}
      </motion.div>

      {/* Recent Uploads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6"
      >
        <h2 className="text-xl font-serif text-[#3A241C] mb-4">Recent Uploads</h2>
        
        {recentUploads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentUploads.map((file) => (
              <div key={file.publicId} className="relative group">
                <div className="aspect-square bg-[#F7F1EC] rounded-lg overflow-hidden">
                  {file.type === 'video' ? (
                    <video src={file.url} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.url;
                      link.download = file.name;
                      link.click();
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                    title="Download"
                  >
                    <Download size={16} className="text-[#3A241C]" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.publicId)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-[#454545] mt-2 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#454545]">
            <ImageIcon className="mx-auto text-[#8A4A32]/30 size-12 mb-4" />
            <p>No media uploaded yet</p>
            <p className="text-sm mt-2 text-[#7F1D1D]">
              Database setup required: Run the SQL from <code className="bg-[#F7F1EC] px-2 py-1 rounded">/lib/database/media-schema.sql</code> in your Supabase SQL Editor
            </p>
          </div>
        )}
      </motion.div>

      {/* Usage Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-[#5C241E] to-[#3A241C] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-serif mb-2">Media Usage</h3>
            <p className="text-white/80 text-sm">
              {recentUploads.length} file{recentUploads.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Storage used</p>
            <p className="text-lg font-medium">
              {(recentUploads.reduce((sum, file) => sum + (file.size || 0), 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
