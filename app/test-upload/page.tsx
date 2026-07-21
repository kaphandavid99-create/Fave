'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function TestUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; publicId: string }>>([]);
  const [selectedFolder, setSelectedFolder] = useState('hair-braiding');

  const handleUpload = (url: string, publicId: string) => {
    setUploadedImages([...uploadedImages, { url, publicId }]);
  };

  const handleDelete = (publicId: string) => {
    setUploadedImages(uploadedImages.filter(img => img.publicId !== publicId));
  };

  return (
    <div className="min-h-screen bg-[#F7F1EC] text-[#3A241C] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#5C241E] mb-8 text-center">Cloudinary Upload Test</h1>

        {/* Folder Selection */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-semibold mb-2">Select Folder:</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8A4A32]"
          >
            <option value="hair-braiding">Hair Braiding</option>
            <option value="services">Services</option>
            <option value="gallery">Gallery</option>
            <option value="customers">Customers</option>
            <option value="test">Test</option>
          </select>
        </div>

        {/* Upload Component */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-serif mb-4">Upload Image/Video</h2>
          <ImageUpload
            onUpload={handleUpload}
            folder={selectedFolder}
            buttonText="Upload to Cloudinary"
          />
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-serif mb-4">Uploaded Images ({uploadedImages.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                    <p className="text-white text-xs mb-1 truncate w-full">{image.url}</p>
                    <button
                      onClick={() => handleDelete(image.publicId)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Before Testing:</h3>
          <ol className="text-yellow-700 text-sm space-y-2 list-decimal list-inside">
            <li>Make sure you've added Cloudinary credentials to your .env.local file</li>
            <li>Required credentials: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET</li>
            <li>Get these from your Cloudinary dashboard after signing up at cloudinary.com</li>
            <li>If you see errors, check your browser console for details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
