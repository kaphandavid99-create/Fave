'use client';

import { useState, useEffect } from 'react';

export default function AdminReelsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [existingReels, setExistingReels] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const res = await fetch('/api/reels');
      const json = await res.json();
      if (json?.success) {
        setDbStatus('connected');
        setExistingReels(json.data || []);
      } else {
        setDbStatus('error');
        setResult(`Error: ${json?.error || 'Unknown error'}`);
      }
    } catch (error) {
      setDbStatus('error');
      setResult('Network error: Cannot connect to server');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setResult('Please select a video file');
        return;
      }
      // Validate file size (max 50MB for reliability)
      if (file.size > 50 * 1024 * 1024) {
        setResult('File size must be less than 50MB');
        return;
      }
      setVideoFile(file);
      setResult(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      setResult('Please select a video file');
      return;
    }

    if (dbStatus !== 'connected') {
      setResult('Database not connected. Please check your database connection.');
      return;
    }

    setLoading(true);
    setResult(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('description', description);

      const xhr = new XMLHttpRequest();
      
      // Increase timeout to 10 minutes for large video files
      xhr.timeout = 600000; // 10 minutes in milliseconds
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Upload response:', xhr.status, xhr.responseText);
        
        if (xhr.status === 200) {
          try {
            const json = JSON.parse(xhr.responseText);
            if (json?.success) {
              setResult('Reel uploaded successfully.');
              setVideoFile(null);
              setDescription('');
              setUploadProgress(0);
              checkDatabaseConnection();
            } else {
              setResult(`Upload failed: ${json?.error || 'Unknown error'}`);
            }
          } catch (e) {
            setResult('Upload failed: Invalid response from server');
          }
        } else {
          setResult(`Upload failed with status ${xhr.status}: ${xhr.responseText}`);
        }
        setLoading(false);
      });

      xhr.addEventListener('error', () => {
        console.error('Upload error occurred');
        setResult('Network error during upload. Please check your internet connection.');
        setLoading(false);
      });

      xhr.addEventListener('timeout', () => {
        console.error('Upload timeout occurred');
        setResult('Upload timed out. The file might be too large. Try a smaller file or check your internet connection.');
        setLoading(false);
      });

      xhr.addEventListener('abort', () => {
        setResult('Upload was cancelled');
        setLoading(false);
      });

      xhr.open('POST', '/api/reels');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setResult(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#3A241C]">Reels</h1>
        <p className="text-[#3A241C]/70 mt-1">Upload video files directly from your device to showcase your braiding styles.</p>
      </div>

      {/* Database Status */}
      <div className={`p-4 rounded-lg border ${
        dbStatus === 'connected' ? 'bg-green-50 border-green-200 text-green-800' :
        dbStatus === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {dbStatus === 'connected' ? '✓ Database Connected' :
             dbStatus === 'error' ? '✗ Database Error' :
             '⟳ Checking Database...'}
          </span>
          {dbStatus === 'error' && (
            <button 
              onClick={checkDatabaseConnection}
              className="text-sm underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
        {dbStatus === 'connected' && (
          <div className="text-sm mt-1">
            {existingReels.length} reel{existingReels.length !== 1 ? 's' : ''} in database
          </div>
        )}
      </div>



      {/* Existing Reels */}
      {existingReels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-5">
          <h2 className="text-lg font-semibold text-[#3A241C] mb-4">Existing Reels</h2>
          <div className="space-y-3">
            {existingReels.map((reel) => (
              <div key={reel.id} className="p-3 bg-[#F7F1EC] rounded-lg">
                <div className="text-sm font-medium text-[#3A241C]">{reel.description || 'No description'}</div>
                <div className="text-xs text-gray-600 mt-1 truncate">
                  <a href={reel.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {reel.videoUrl}
                  </a>
                </div>
                <div className="text-xs text-gray-500 mt-1">{reel.viewCount} views</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3A241C]">Video File (9:16, max 50MB)</label>
          <div className="mt-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-[#3A241C]/20 rounded-lg bg-[#F7F1EC] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8A4A32] file:text-white hover:file:bg-[#6B3A24]"
            />
            {videoFile && (
              <div className="mt-2 text-sm text-[#3A241C]/70">
                Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3A241C]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Box braids with a clean edge..."
            className="mt-2 w-full min-h-[100px] px-3 py-2 border border-[#3A241C]/20 rounded-lg bg-[#F7F1EC]"
          />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#8A4A32] h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !videoFile || dbStatus !== 'connected'}
          className="px-4 py-2 rounded-lg bg-[#8A4A32] text-white font-semibold hover:bg-[#6B3A24] transition disabled:opacity-50"
        >
          {loading ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` : 'Upload reel'}
        </button>

        {result && <div className={`text-sm ${result.includes('error') || result.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{result}</div>}
      </form>

      <div className="text-sm text-[#3A241C]/60">
        <p className="font-medium mb-2">Upload Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select a video file from your device (max 50MB)</li>
          <li>Use 9:16 vertical video format for best mobile experience</li>
          <li>Add a description for the braiding style</li>
          <li>Videos will be stored locally and served from your server</li>
        </ol>
        <p className="mt-3 font-medium">Note: Videos are stored locally. For production, consider using Cloudinary for better performance.</p>
      </div>
    </div>
  );
}

