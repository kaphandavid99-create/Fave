'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const IMAGES = Array.from({ length: 9 }, (_, i) => `/g${i + 1}.jpeg`);

export default function WaveWakeCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);
  const speedRef = useRef<number>(0.04); // px per ms-ish
  const doubled = useMemo(() => [...IMAGES, ...IMAGES], []);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoveredIndex = useRef<number | null>(null);
  const windTime = useRef<number>(0);
  const shakeOffsets = useRef<{x: number, y: number, rotation: number}[]>([]);


  useEffect(() => {
    const tick = (t: number) => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const last = lastTRef.current || t;
      const dt = t - last;
      lastTRef.current = t;
      windTime.current += dt * 0.001; // Increment wind time for swaying effect

      // Animate left->right by translating the track horizontally.
      // We loop by resetting when we hit half width (because content is duplicated).
      const translate = parseFloat(track.dataset.x ?? '0');
      const next = translate - dt * speedRef.current;
      track.dataset.x = String(next);
      track.style.transform = `translate3d(${next}px, 0, 0)`;

      // Apply stylish effects to each item based on position
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        
        // Skip the hovered item to preserve hover effect
        if (hoveredIndex.current === index) return;
        
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distanceFromCenter = (itemCenter - centerX) / containerRect.width;
        
        // Create wind-blown effect from the right with swaying and shaking motion
        const normalizedDistance = Math.abs(distanceFromCenter);
        const scale = 1 - (normalizedDistance * 0.1); // Slight scale variation
        
        // Wind effects
        const windSway = Math.sin(windTime.current * 2 + index * 0.5) * 3; // Gentle swaying motion
        const windRotation = -15 + (distanceFromCenter * 6) + windSway; // Wind blows from right, tilt left with sway
        const windTiltX = 4 + (normalizedDistance * 2) + Math.sin(windTime.current * 1.5 + index * 0.3) * 2; // Upward tilt with sway
        const windPush = distanceFromCenter * 20 + Math.sin(windTime.current * 3 + index * 0.7) * 5; // Push effect with pulsing
        
        // Shake/tremble effect (rapid small movements)
        const shakeX = Math.sin(windTime.current * 8 + index * 0.8) * 2 + shakeOffsets.current[index]?.x || 0;
        const shakeY = Math.cos(windTime.current * 7 + index * 0.6) * 1.5 + shakeOffsets.current[index]?.y || 0;
        const shakeRotation = Math.sin(windTime.current * 9 + index * 0.4) * 1.5 + shakeOffsets.current[index]?.rotation || 0;
        
        const brightness = 1 - (normalizedDistance * 0.15); // Subtle brightness variation
        const saturation = 1 + (normalizedDistance * 0.2); // Enhanced saturation
        
        const card = item.querySelector('.wakeCard') as HTMLElement;
        if (card) {
          card.style.transform = `scale(${Math.max(0.9, scale)}) rotateY(${windRotation + shakeRotation}deg) rotateX(${windTiltX}deg) translateX(${windPush + shakeX}px) translateY(${shakeY}px)`;
          card.style.filter = `brightness(${Math.max(0.85, brightness)}) saturate(${saturation})`;
          card.style.transition = 'transform 0.1s ease-out, filter 0.2s ease-out';
        }
      });

      // reset point: when the first set has fully moved out.
      // Use track width of a single set by measuring child width sum.
      const singleWidth = track.dataset.singleWidth ? Number(track.dataset.singleWidth) : 0;
      if (singleWidth > 0 && Math.abs(next) >= singleWidth) {
        // Shift forward by exactly one singleWidth so we keep continuity.
        track.dataset.x = String(next + singleWidth);
        track.style.transform = `translate3d(${next + singleWidth}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // measure width of one set (half of the duplicated track)
    const total = track.scrollWidth;
    const single = total / 2;
    track.dataset.singleWidth = String(single);
    
    // Initialize random shake offsets for each item
    shakeOffsets.current = doubled.map(() => ({
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      rotation: (Math.random() - 0.5) * 3
    }));
  }, [doubled]);




  return (
    <section className="relative -mt-6 pb-10 overflow-hidden">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">

          <div className="relative px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#8A4A32] to-[#6A3A22] text-white text-xs tracking-[0.2em] font-semibold rounded-full">
                    GALLERY
                  </span>
                  <span className="ml-2 text-xs tracking-[0.15em] text-black/50 font-light">BRAIDING ARTISTRY</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  Where Every Strand<br />
                  <span className="italic font-light">Tells a Story</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light max-w-xl" style={{ letterSpacing: '0.02em' }}>
                  Discover the intricate artistry and cultural heritage woven into each braid. Our gallery showcases the fusion of <span className="font-semibold text-black">traditional techniques</span> with <span className="font-semibold text-black">contemporary elegance</span>.
                </p>
              </div>
              <div className="hidden md:block text-right mt-4 md:mt-0">
                <div className="border-l-2 border-[#8A4A32] pl-4">
                  <p className="text-sm text-black/80 font-medium">Wind-swept gallery</p>
                  <p className="text-xs text-black/60 mt-1 italic">Hover to explore</p>
                </div>
              </div>
            </div>

            <div className="relative" ref={containerRef}>

              <div className="relative">
                <div
                  ref={trackRef}
                  className="flex gap-4 sm:gap-6"
                  data-x="0"
                  style={{ 
                    padding: '10px 2px',
                    willChange: 'transform'
                  }}
                >
                  {doubled.map((src, idx) => {
                    const n = (idx % 9) + 1;
                    return (
                      <div 
                        key={`${src}-${idx}`}
                        ref={(el) => { itemRefs.current[idx] = el; }}
                        style={{
                          flex: '0 0 auto',
                          width: 'clamp(120px, 13vw, 180px)',
                          height: 'clamp(160px, 18vw, 240px)',
                          perspective: '1000px'
                        }}
                      >
                        <div 
                          className="wakeCard"
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            borderRadius: '1.25rem',
                            border: '1px solid rgba(255,255,255,0.10)',
                            background: 'transparent',
                            boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
                            cursor: 'default',
                            transition: 'transform 0.1s ease-out, filter 0.3s ease-out',
                            transformStyle: 'preserve-3d'
                          }}
                          onMouseEnter={(e) => {
                            hoveredIndex.current = idx;
                            const card = e.currentTarget;
                            // Wind gust effect on hover - more dramatic rotation, scale, and shake
                            const shakeX = Math.sin(windTime.current * 12 + idx * 0.8) * 3;
                            const shakeY = Math.cos(windTime.current * 11 + idx * 0.6) * 2;
                            const shakeRotation = Math.sin(windTime.current * 13 + idx * 0.4) * 2;
                            card.style.transform = `rotateY(${-20 + shakeRotation}deg) rotateX(${8 + shakeRotation}deg) scale(1.12) translateX(${-10 + shakeX}px) translateY(${shakeY}px)`;
                            card.style.filter = 'brightness(1.15) saturate(1.25)';
                          }}
                          onMouseLeave={(e) => {
                            hoveredIndex.current = null;
                            const card = e.currentTarget;
                            card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1) translateX(0) translateY(0)';
                            card.style.filter = 'brightness(1) saturate(1)';
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                              src={src}
                              alt={`Gallery ${n}`}
                              fill
                              sizes="(max-width: 640px) 70vw, 180px)"
                              style={{
                                objectFit: 'cover',
                                filter: 'saturate(1.05) contrast(1.04)'
                              }}
                              priority={idx < 3}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 hidden md:flex items-center justify-center gap-3 text-[11px] text-white/50">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#8A4A32]" />
              <span>Non-stop continuous horizontal movement</span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#8A4A32]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

