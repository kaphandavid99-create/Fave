'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function usePrefersReducedMotion() {
  const ref = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    ref.current = !!mql.matches;
    const handler = () => {
      ref.current = !!mql.matches;
    };

    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler);
    else mql.addListener(handler);

    return () => {
      if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  return ref;
}

function TransformationParticles() {
  const groupRef = useRef<THREE.Group | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const { size } = useThree();
  const reducedMotionRef = usePrefersReducedMotion();

  const config = useMemo(() => {
    const count = 2400;
    const seed = 1337;
    const palette = [
      new THREE.Color('#F59E0B'),
      new THREE.Color('#FBBF24'),
      new THREE.Color('#F97316'),
      new THREE.Color('#E11D48'),
    ];

    let s = seed;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    const base = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const r = Math.pow(rand(), 0.55) * 18;
      const a = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 14;
      base[i3 + 0] = Math.cos(a) * r;
      base[i3 + 1] = y;
      base[i3 + 2] = Math.sin(a) * r;


      // Target: a braid-like lattice (two arcs woven)
      const t = i / (count - 1); // 0..1 along the “braid”
      const angle = t * Math.PI * 5;
      const twist = Math.sin(t * Math.PI * 4) * 0.9;

      const lane = i % 2 === 0 ? 1 : -1;
      const weave = Math.sin(angle * 2 + (lane < 0 ? Math.PI / 2 : 0)) * 1.6;

      const braidRadius = 7.6;
      const x = Math.cos(angle + twist) * braidRadius + lane * weave * 0.25;
      const z = Math.sin(angle + twist) * braidRadius + lane * weave * 0.25;
      const yy = (t - 0.5) * 22;

      target[i3 + 0] = x;
      target[i3 + 1] = yy;
      target[i3 + 2] = z;

      const c = palette[Math.floor(rand() * palette.length)];
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { count, base, target, colors };
  }, []);

  const stateRef = useRef({
    progress: 0, // 0 base -> 1 target
    t0: 0,
    pointerX: 0,
    pointerY: 0,
    lastW: 0,
  });

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      stateRef.current.pointerX = (e.clientX / w - 0.5) * 2; // -1..1
      stateRef.current.pointerY = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(config.base.slice(0), 3));
    geom.setAttribute('color', new THREE.BufferAttribute(config.colors, 3));
    return geom;
  }, [config]);

  useFrame((st) => {
    const points = pointsRef.current;
    const geom = points?.geometry;
    if (!points || !geom) return;

    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;

    // Scroll-ish easing: progress pulses based on time to simulate “transformation page” magic
    // (avoids needing external scroll hooks)
    const t = st.clock.getElapsedTime();
    const reduced = reducedMotionRef.current;

    // If reduced motion: hold at a pleasing mid-state and stop heavy motion
    const desired = reduced ? 0.78 : (0.35 + 0.3 * Math.sin(t * 0.55) + 0.25 * Math.sin(t * 0.21));
    const clamped = THREE.MathUtils.clamp(desired, 0.0, 1.0);

    stateRef.current.progress = THREE.MathUtils.damp(
      stateRef.current.progress,
      clamped,
      8,
      st.clock.getDelta()
    );

    const p = stateRef.current.progress;

    const arr = posAttr.array as Float32Array;
    const base = config.base;
    const target = config.target;

    // pointer parallax
    const px = stateRef.current.pointerX;
    const py = stateRef.current.pointerY;

    // morph + subtle flutter + depth “breathing”
    const breathe = reduced ? 0.0 : 1.0;
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;
      const bx = base[i3 + 0];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];
      const tx = target[i3 + 0];
      const ty = target[i3 + 1];
      const tz = target[i3 + 2];

      // “weave” flutter only on target side
      const flutter = reduced ? 0 : Math.sin(t * 2.2 + i * 0.06) * 0.35 * (p * (1 - p) + 0.06);
      const flutter2 = reduced ? 0 : Math.cos(t * 1.7 + i * 0.045) * 0.25 * (p * (1 - p) + 0.05);

      arr[i3 + 0] = THREE.MathUtils.lerp(bx, tx, p) + flutter * 0.35 + px * 0.9;
      arr[i3 + 1] = THREE.MathUtils.lerp(by, ty, p) + flutter2 * 0.35 + py * 0.6;
      arr[i3 + 2] = THREE.MathUtils.lerp(bz, tz, p) + flutter2 * 0.35 + px * -0.7;

      // tiny breathing scale by pushing points along their own direction
      if (breathe) {
        const len = Math.sqrt(arr[i3 + 0] ** 2 + arr[i3 + 1] ** 2 + arr[i3 + 2] ** 2) || 1;
        const nX = arr[i3 + 0] / len;
        const nY = arr[i3 + 1] / len;
        const nZ = arr[i3 + 2] / len;
        const s = (0.02 + 0.01 * Math.sin(t + i * 0.02)) * p;
        arr[i3 + 0] += nX * s;
        arr[i3 + 1] += nY * s;
        arr[i3 + 2] += nZ * s;
      }
    }

    posAttr.needsUpdate = true;

    // group rotation for “exceptional” motion
    if (groupRef.current) {
      groupRef.current.rotation.y = (reduced ? 0.07 : 0.16) * t + px * 0.25;
      groupRef.current.rotation.x = (reduced ? 0.03 : 0.06) * Math.sin(t * 0.65) + py * -0.06;
    }

    // dynamic point sizing
    const targetSize = reduced ? 0.014 : 0.0155 + 0.004 * Math.sin(t * 0.9);
    const sizeAttr = pointsRef.current?.material as THREE.PointsMaterial | undefined;
    if (sizeAttr) sizeAttr.size = targetSize * (size.height / 800);
  });

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.016,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}

export default function TransformationThreeAnimation() {
  return (
    <div className="relative w-full h-[400px] md:h-[450px] rounded-lg overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 35], fov: 45 }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.25} />
        <pointLight position={[15, 10, 25]} intensity={0.6} />
        <TransformationParticles />
      </Canvas>

      {/* removed vignette/gradient overlay */}

      {/* corner border for premium feel (kept) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 8,
          border: '1px solid rgba(245,158,11,0.18)',
          boxShadow: '0 0 22px rgba(245,158,11,0.14), inset 0 0 22px rgba(245,158,11,0.08)',
        }}
      />
    </div>
  );
}

