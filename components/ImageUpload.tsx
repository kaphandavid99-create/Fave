'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';

interface ImageUploadProps {
  onUpload: (url: string, publicId: string) => void;
  folder?: string;
  buttonText?: string;
  resetKey?: number;
}

export default function ImageUpload({ 
  onUpload, 
  folder = 'hair-braiding', 
  buttonText = 'Upload Image',
  resetKey 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetKey]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.url, data.publicId);
        setPreview(data.url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-white">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8A4A32] transition-colors disabled:cursor-not-allowed"
        >
          <div className="text-center">
            {isUploading ? (
              <div className="text-[#8A4A32]">Uploading...</div>
            ) : (
              <>
                <div className="text-2xl mb-2 flex justify-center"><FaCamera /></div>
                <div className="text-sm text-gray-600">{buttonText}</div>
                <div className="text-xs text-gray-400 mt-1">Images or videos</div>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  );
}
