'use client';

import { useMemo } from 'react';
import Particles from 'react-tsparticles';

export default function FooterParticles() {
  const options = useMemo(
    () => ({
      fullScreen: false,
      background: undefined,
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 60, density: { enable: true, area: 800 } },
        color: { value: ['#7F1D1D', '#C4705B', '#D4C4B5'] },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 120,
          color: '#C4705B',
          opacity: 0.25,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          random: true,
          outModes: { default: 'out' as const },
        },
      },
      interactivity: {
        detectsOn: undefined,
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          repulse: { distance: 80, duration: 0.4 },
          push: { quantity: 6 },
        },
      },
    }),
    [],
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <Particles
        id="footer-particles"
        options={options}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );

}

