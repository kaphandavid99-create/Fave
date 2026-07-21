'use client';

import { useState } from 'react';

export default function TestVideoPage() {
  const [videoUrl, setVideoUrl] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Video Test Page</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test with sample video */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 1: Sample Video</h2>
          <video
            src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
            controls
            className="w-full max-w-md"
          />
        </div>

        {/* Test with custom URL */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 2: Custom Video URL</h2>
          <input
            type="text"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              className="w-full max-w-md"
              onError={(e) => console.error('Video error:', e)}
            />
          )}
        </div>

        {/* Test with Cloudinary format */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 3: Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Test 1 should work with a sample video</li>
            <li>For Test 2, paste your Cloudinary video URL</li>
            <li>Check browser console for errors</li>
            <li>Cloudinary URLs should work like: https://res.cloudinary.com/cloud-name/video/upload/... </li>
          </ol>
        </div>
      </div>
    </div>
  );
}