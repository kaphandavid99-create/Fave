'use client';

import { motion, useReducedMotion } from 'framer-motion';

function Cloud({
  className,
  style,
  delay,
}: {
  className?: string;
  style: React.CSSProperties;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x: -60 }}
      animate={{
        // Make the clouds more visible by keeping opacity higher
        opacity: [0, 0.95, 0.95, 0],
        x: reduceMotion ? 0 : [0, 120, -40, 140],
        y: reduceMotion ? 0 : [0, -10, 5, -8],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: reduceMotion ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 600 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>
        </defs>

        <g filter="url(#softGlow)" opacity="1">
          <path
            d="M170 170C115 170 70 140 70 100C70 70 98 45 135 45C150 25 176 12 210 12C260 12 304 38 315 73C333 60 355 53 380 53C440 53 490 94 490 140C490 165 468 183 445 183H170Z"
            fill="url(#cloudGrad)"
          />
          <path
            d="M235 195C185 195 145 180 145 155C145 132 170 115 205 115C225 92 256 78 292 78C350 78 398 115 405 150C430 135 460 132 484 142C505 150 516 166 516 182C516 195 500 205 482 205H235Z"
            fill="rgba(255,255,255,0.30)"
          />
        </g>
      </svg>
    </motion.div>
  );
}

export default function HeroClouds() {
  // 3 clouds with different sizes + paths
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud
        delay={0}
        style={{
          position: 'absolute',
          top: '18%',
          left: '-10%',
          width: 420,
          height: 140,
        }}
      />
      <Cloud
        delay={2.2}
        style={{
          position: 'absolute',
          top: '32%',
          left: '-20%',
          width: 520,
          height: 170,
          opacity: 0.85,
        }}
      />
      <Cloud
        delay={4.1}
        style={{
          position: 'absolute',
          top: '10%',
          left: '-25%',
          width: 360,
          height: 120,
          opacity: 0.75,
        }}
      />
    </div>
  );
}

