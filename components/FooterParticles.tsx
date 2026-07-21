'use client';

import { useMemo } from 'react';

export default function FooterParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${(index * 13) % 100}%`,
        top: `${(index * 17 + 7) % 100}%`,
        size: 4 + (index % 5) * 2,
        delay: `${(index % 6) * 0.7}s`,
        duration: `${8 + (index % 5) * 2}s`,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: '100%', height: '100%' }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at top, rgba(196, 112, 91, 0.16), transparent 55%)',
        }}
      />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-[#c4705b]/70"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: 0.2 + (particle.id % 4) * 0.12,
            animation: `float ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

