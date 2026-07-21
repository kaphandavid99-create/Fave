'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function AdminHeroScene() {
  const reduced = usePrefersReducedMotion();

  const groupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlesMatRef = useRef<THREE.PointsMaterial | null>(null);

  const sceneData = useMemo(() => {
    const ringCount = 6;

    const particleCount = 1100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colA = new THREE.Color('#C4705B');
    const colB = new THREE.Color('#8A4A32');
    const colC = new THREE.Color('#D4C4B5');

    const colorsPool = [colA, colB, colC];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const a = Math.random() * Math.PI * 2;
      const r = 3.8 + Math.random() * 7.4;
      const y = (Math.random() - 0.5) * 7.2;

      positions[i3 + 0] = Math.cos(a) * r;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(a) * r;

      const c = colorsPool[Math.floor(Math.random() * colorsPool.length)];
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const rings = Array.from({ length: ringCount }).map((_, idx) => {
      const t = idx / (ringCount - 1);
      const radius = 1.3 + t * 2.25;
      const tube = 0.12 + (1 - t) * 0.08;
      const segments = 150;

      const color = new THREE.Color('#C4705B').lerp(
        new THREE.Color('#D4C4B5'),
        0.2 + 0.55 * (1 - t)
      );

      return { radius, tube, segments, color };
    });

    return { geometry, material, rings };
  }, []);

  const { geometry, material, rings } = sceneData;

  const points = useMemo(() => new THREE.Points(geometry, material), [geometry, material]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const speed = reduced ? 0.15 : 1;


    // Make motion unmissable: rotation + subtle breathing + a particle “swirl”.
    const spin = reduced ? 0.35 : t * 1.05 * speed;
    groupRef.current.rotation.y = spin;
    groupRef.current.rotation.x = reduced ? -0.06 : Math.sin(t * 0.65) * 0.28 * speed;
    groupRef.current.rotation.z = reduced ? 0 : Math.sin(t * 0.22) * 0.16 * speed;

    const breathe = reduced ? 1 : 1 + Math.sin(t * 1.25) * 0.035 * speed;
    groupRef.current.scale.set(breathe, breathe, breathe);

    if (particlesRef.current) {
      const swirl = reduced ? 0.12 : t * 0.75 * speed;
      particlesRef.current.rotation.y = swirl;
      particlesRef.current.rotation.x = reduced ? 0.06 : Math.sin(t * 0.85) * 0.18 * speed;
      particlesRef.current.position.y = reduced ? 0 : Math.sin(t * 0.7) * 0.45;
      particlesRef.current.position.x = reduced ? 0 : Math.sin(t * 0.33) * 0.22;
    }

    if (particlesMatRef.current) {
      const s = reduced ? 0 : Math.sin(t * 1.05) * 0.09;
      particlesMatRef.current.size = clamp(0.05 + s, 0.03, 0.1);
      particlesMatRef.current.opacity = reduced ? 0.78 : 0.56 + Math.sin(t * 0.65) * 0.26;
    }

  });

  return (
    <group ref={groupRef}>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.62, 50, 50]} />
        <meshStandardMaterial
          color={'#F6C8B7'}
          emissive={'#C4705B'}
          emissiveIntensity={reduced ? 1.1 : 1.75}
          roughness={0.25}
          metalness={0.14}
        />
      </mesh>

      {/* rings */}
      {rings.map((r, idx) => (
        <mesh
          key={idx}
          position={[0, Math.sin(idx * 0.6) * 0.12, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusKnotGeometry args={[r.radius, r.tube, r.segments, 14]} />
          <meshStandardMaterial
            color={r.color}
            emissive={r.color}
            emissiveIntensity={reduced ? 0.35 : 0.55}
            roughness={0.35}
            metalness={0.35}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}

      {/* particles */}
      <primitive
        object={points}
        ref={(obj: unknown) => {
          if (!obj) return;
          particlesRef.current = obj as THREE.Points;
          particlesMatRef.current = material;
        }}
      />


      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 8, 6]} intensity={1.15} color={'#D4C4B5'} />
      <directionalLight position={[-8, -4, -6]} intensity={0.75} color={'#C4705B'} />
    </group>
  );
}

export default function AdminHeroThreeAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <AdminHeroScene />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F7F1EC]/80" />
    </div>
  );
}



