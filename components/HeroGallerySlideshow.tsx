'use client';

import { useEffect, useMemo, useState } from 'react';

const HERO_IMAGES = [
  '/g1.jpeg',
  '/g2.jpeg',
  '/g3.jpeg',
  '/g4.jpeg',
  '/g5.jpeg',
  '/g6.jpeg',
  '/g7.jpeg',
  '/g8.jpeg',
  '/g9.jpeg',
];

export default function HeroGallerySlideshow({
  images = HERO_IMAGES,
  durationMs = 12_000,
  transitionMs = 900,
}: {
  images?: string[];
  durationMs?: number; // how long each image stays fully visible
  transitionMs?: number; // crossfade duration
}) {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>(() => ({ 0: true }));

  useEffect(() => {
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, durationMs);

    return () => window.clearInterval(id);
  }, [durationMs, images.length, reducedMotion]);

  // If reduced motion, just show first image.
  const active = reducedMotion ? 0 : index;

  const next = (active + 1) % images.length;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style jsx global>{`
        @keyframes heroGalleryKenBurns {
          0% { transform: scale(1.08); filter: saturate(1.05) contrast(1.03) brightness(1.0); }
          100% { transform: scale(1.0); filter: saturate(1.15) contrast(1.07) brightness(1.03); }
        }

        @keyframes heroGalleryIn {
          0% { opacity: 0; transform: scale(1.03) translateY(6px); }
          100% { opacity: 1; transform: scale(1.0) translateY(0px); }
        }
      `}</style>

      {/* Active image */}
      <img
        key={active}
        src={images[active]}
        alt="Hero gallery background"
        className="absolute inset-0 h-full w-full object-cover"
        style={
          {
            opacity: 1,
            // Avoid hydration mismatches by ensuring the exact same values on server+client.
            transition: reducedMotion ? 'none' : `opacity ${transitionMs}ms ease-in-out`,
            animation: reducedMotion
              ? 'none'
              : `heroGalleryKenBurns ${Math.max(4000, durationMs)}ms linear both`,
          } as React.CSSProperties
        }
        onLoad={() => setLoaded((m) => ({ ...m, [active]: true }))}
      />

      {/* Crossfade layer for immediate transition */}
      {!reducedMotion && (
        <img
          key={next}
          src={images[next]}
          alt="Hero gallery background preloading"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: 0,
            transition: `opacity ${transitionMs}ms ease-in-out`,
            animation: loaded[next] ? `heroGalleryIn ${transitionMs}ms ease-out both` : 'none',
          }}
          onLoad={() => setLoaded((m) => ({ ...m, [next]: true }))}
        />
      )}

      {/* Professional color overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Subtle vignette for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 30% 20%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%), radial-gradient(900px 450px at 70% 70%, rgba(0,0,0,0), rgba(0,0,0,0.55) 70%)',
        }}
      />
    </div>
  );
}

