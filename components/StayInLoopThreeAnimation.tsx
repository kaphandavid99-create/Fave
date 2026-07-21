'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}


function LoopScene({ speed = 1 }: { speed?: number }) {
  const group = useRef<THREE.Group | null>(null);
  const { viewport } = useThree();

  const particleData = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colA = new THREE.Color('#C4705B');
    const colB = new THREE.Color('#8A4A32');
    const colC = new THREE.Color('#D4C4B5');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // cylindrical ribbon-ish field around center
      const a = Math.random() * Math.PI * 2;
      const r = 4.2 + Math.random() * 6.5;
      const y = (Math.random() - 0.5) * 6.5;

      positions[i3 + 0] = Math.cos(a) * r;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(a) * r;

      const c = [colA, colB, colC][Math.floor(Math.random() * 3)];
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { count, positions, colors };
  }, []);

  const ringData = useMemo(() => {
    const rings = 5;
    return Array.from({ length: rings }).map((_, idx) => {
      const t = idx / (rings - 1);
      const radius = 1.4 + t * 1.9;
      const tube = 0.12 + (1 - t) * 0.09;
      const segments = 160;

      const hueScale = 1 - t;
      const color = new THREE.Color('#C4705B').lerp(new THREE.Color('#D4C4B5'), 0.35 + 0.4 * hueScale);

      return {
        radius,
        tube,
        segments,
        color,
        offset: idx * 0.25,
      };
    });
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3));
    return g;
  }, [particleData]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const points = useMemo(() => new THREE.Points(geometry, material), [geometry, material]);

  const pointsRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;

    if (group.current) {
      group.current.rotation.y = t * 0.25;
      group.current.rotation.x = Math.sin(t * 0.35) * 0.12;
      group.current.rotation.z = Math.sin(t * 0.22) * 0.06;
    }

    // particle swirl (mutate via refs to satisfy lint)
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.45;
      pointsRef.current.position.y = Math.sin(t * 0.7) * 0.35;
    }

    const sizeScale = clamp(0.9 + Math.sin(t * 1.0) * 0.12, 0.75, 1.15);
    if (materialRef.current) {
      materialRef.current.size = 0.045 * sizeScale;
      materialRef.current.opacity = 0.75 + Math.sin(t * 0.9) * 0.15;
    }
  });


  return (
    <group ref={group}>
      {/* main bright core */}
      <mesh>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial
          color={'#F6C8B7'}
          emissive={'#C4705B'}
          emissiveIntensity={1.8}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* torus-rings / ribbons */}
      {ringData.map((r, idx) => (
        <mesh
          key={idx}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, Math.sin(idx * 0.7) * 0.12, 0]}
        >
          <torusKnotGeometry args={[r.radius, r.tube, r.segments, 16]} />
          <meshStandardMaterial
            color={r.color}
            emissive={r.color}
            emissiveIntensity={0.55}
            roughness={0.3}
            metalness={0.4}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}

      {/* particle stream */}
      <primitive
        object={points}
        ref={(obj: unknown) => {
          if (!obj) return;
          pointsRef.current = obj as THREE.Points;
          materialRef.current = material as THREE.PointsMaterial;
        }}
      />


      {/* lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 8, 6]} intensity={1.2} color={'#D4C4B5'} />
      <directionalLight position={[-8, -4, -6]} intensity={0.75} color={'#C4705B'} />


    </group>
  );
}

export default function StayInLoopThreeAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 35 }}
        style={{ width: '100%', height: '100%' }}
      >
        <LoopScene speed={1.25} />
      </Canvas>
    </div>
  );
}

