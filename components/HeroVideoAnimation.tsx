'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroVideoAnimation({
  videoSrc = '/hero-video.mp4',
}: {
  videoSrc?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackAttempted, setPlaybackAttempted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let isMounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;

    const handleVideoReady = () => {
      if (!isMounted) return;
      console.log('Video ready state:', v.readyState);
      setCanPlay(true);
      setIsLoading(false);
    };

    const attemptPlay = async () => {
      if (!isMounted || playbackAttempted) return;
      
      setPlaybackAttempted(true);
      
      try {
        // Set playback rate to 1.0 for normal smooth playback
        v.playbackRate = 1.0;
        
        // Try different play strategies
        if (v.readyState >= 2) { // HAVE_CURRENT_DATA
          await v.play();
          console.log('Video playback started successfully');
        } else {
          // Wait for video to be ready
          v.addEventListener('canplay', () => {
            if (isMounted) {
              v.play().catch(console.error);
            }
          }, { once: true });
        }
      } catch (error) {
        console.log('Autoplay prevented, retrying...');
        // Retry after a short delay
        retryTimeout = setTimeout(() => {
          if (isMounted) {
            v.play().catch(err => console.log('Retry failed:', err));
          }
        }, 1000);
      }
    };

    const onLoadedMetadata = () => {
      console.log('Video metadata loaded');
      if (isMounted) {
        handleVideoReady();
        attemptPlay();
      }
    };

    const onCanPlay = () => {
      console.log('Video can play');
      if (isMounted) {
        handleVideoReady();
      }
    };

    const onCanPlayThrough = () => {
      console.log('Video can play through without buffering');
      if (isMounted) {
        handleVideoReady();
      }
    };

    const onPlay = () => {
      console.log('Video is playing');
      if (isMounted) {
        setCanPlay(true);
        setIsLoading(false);
      }
    };

    const onPlaying = () => {
      console.log('Video is playing smoothly');
      if (isMounted) {
        setCanPlay(true);
        setIsLoading(false);
      }
    };

    const onWaiting = () => {
      console.log('Video is buffering...');
    };

    const onError = (e: Event) => {
      console.error('Video error:', e);
      if (isMounted) {
        setVideoError(true);
        setIsLoading(false);
      }
    };

    const onStalled = () => {
      console.log('Video stalled, attempting to recover');
      if (isMounted && !v.paused) {
        // Try to recover by seeking slightly
        const currentTime = v.currentTime;
        v.currentTime = currentTime + 0.1;
      }
    };

    const onSuspend = () => {
      console.log('Video suspended');
    };

    // Add event listeners
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('canplaythrough', onCanPlayThrough);
    v.addEventListener('play', onPlay);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('error', onError);
    v.addEventListener('stalled', onStalled);
    v.addEventListener('suspend', onSuspend);

    // Set video attributes for smooth playback
    v.preload = 'auto';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;

    // Load the video
    v.load();

    // Visibility handling
    const onVisibilityChange = () => {
      if (!isMounted) return;
      
      if (document.visibilityState === 'visible') {
        // When page becomes visible, ensure smooth playback
        if (!v.paused) {
          v.play().catch(console.error);
        }
      } else {
        // Pause when hidden to save resources
        try {
          v.pause();
        } catch (e) {
          // ignore
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    // Cleanup
    return () => {
      isMounted = false;
      
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      
      document.removeEventListener('visibilitychange', onVisibilityChange);
      
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('canplaythrough', onCanPlayThrough);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('error', onError);
      v.removeEventListener('stalled', onStalled);
      v.removeEventListener('suspend', onSuspend);
    };
  }, [playbackAttempted]);


  return (
    <div className="absolute inset-0 overflow-hidden">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .hero-video {
          animation: fadeIn 0.5s ease-in-out forwards;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
      
      {/* Video layer */}
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover hero-video"
          style={{ 
            opacity: canPlay ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            willChange: 'transform',

          }}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      )}

      {/* Fallback image if video fails or loading */}
      {(videoError || isLoading) && (
        <img
          src="/hero-img.jpg"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        />
      )}

      {/* Color overlay */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}

