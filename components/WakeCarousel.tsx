'use client';

import { useMemo, useState } from 'react';

/**
 * Minimal, valid implementation.
 * The previous file was truncated (causing build TypeScript errors).
 */
export default function WakeCarousel() {
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => [
      { title: 'Silk Wake', subtitle: 'Smooth, gentle look' },
      { title: 'Golden Tone', subtitle: 'Warm highlights' },
      { title: 'Cloud Finish', subtitle: 'Soft volume' },
    ],
    [],
  );

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  const current = items[index];

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3A241C]">{current.title}</h2>
            <p className="text-sm md:text-base text-[#454545] mt-1">{current.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="px-3 py-2 rounded-lg border border-[#3A241C]/20 bg-white hover:bg-[#F7F1EC] transition text-sm"
              aria-label="Previous"
              type="button"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="px-3 py-2 rounded-lg border border-[#3A241C]/20 bg-white hover:bg-[#F7F1EC] transition text-sm"
              aria-label="Next"
              type="button"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

