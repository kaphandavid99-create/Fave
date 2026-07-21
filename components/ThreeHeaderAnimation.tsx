'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FlowerPetals() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  const velocities = useRef<any[]>([]);

  useEffect(() => {
    if (!particlesRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const rotations = new Float32Array(count * 3);

    // Feminine flower colors
    const petalColors = [
      new THREE.Color('#FFB6C1'), // Light pink
      new THREE.Color('#FFC0CB'), // Pink
      new THREE.Color('#FF69B4'), // Hot pink
      new THREE.Color('#E6E6FA'), // Lavender
      new THREE.Color('#DDA0DD'), // Plum
      new THREE.Color('#FFE4E6'), // Rose
      new THREE.Color('#F0E6FF'), // Soft purple
      new THREE.Color('#FFF0F5'), // Lavender blush
    ];

    for (let i = 0; i < count; i++) {
      // Spread particles across the scene
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Random colors from palette
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Varying sizes for depth
      sizes[i] = Math.random() * 2 + 0.5;

      // Initial rotations
      rotations[i * 3] = Math.random() * Math.PI;
      rotations[i * 3 + 1] = Math.random() * Math.PI;
      rotations[i * 3 + 2] = Math.random() * Math.PI;

      // Random velocities for organic movement
      velocities.current.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.01 - 0.005, // Slight downward drift
        z: (Math.random() - 0.5) * 0.02,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        rotZ: (Math.random() - 0.5) * 0.02,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 3));

    particlesRef.current.geometry = geometry;
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const geometry = particlesRef.current.geometry;
    if (!geometry.attributes.position || !geometry.attributes.rotation) return;

    const posArray = geometry.attributes.position.array as Float32Array;
    const rotArray = geometry.attributes.rotation.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Update positions with drift
      posArray[i * 3] += velocities.current[i].x;
      posArray[i * 3 + 1] += velocities.current[i].y;
      posArray[i * 3 + 2] += velocities.current[i].z;

      // Update rotations for petal fluttering effect
      rotArray[i * 3] += velocities.current[i].rotX + Math.sin(state.clock.getElapsedTime() + i) * 0.01;
      rotArray[i * 3 + 1] += velocities.current[i].rotY + Math.cos(state.clock.getElapsedTime() + i) * 0.01;
      rotArray[i * 3 + 2] += velocities.current[i].rotZ + Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.01;

      // Reset particles that go out of bounds
      if (posArray[i * 3 + 1] < -5) {
        posArray[i * 3] = (Math.random() - 0.5) * 15;
        posArray[i * 3 + 1] = 5;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      if (posArray[i * 3] < -8 || posArray[i * 3] > 8) {
        posArray[i * 3] = (Math.random() - 0.5) * 15;
      }
      if (posArray[i * 3 + 2] < -8 || posArray[i * 3 + 2] > 8) {
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.rotation.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function LargePetals() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.3, 0.2, 0.5, 0.8, 0.2, 1);
    shape.bezierCurveTo(0, 1.2, -0.2, 1, -0.2, 0.6);
    shape.bezierCurveTo(-0.3, 0.3, -0.1, 0.1, 0, 0);

    return new THREE.ShapeGeometry(shape);
  }, []);

  const petalColors = [
    '#FFB6C1', '#FFC0CB', '#FF69B4', '#E6E6FA', 
    '#DDA0DD', '#FFE4E6', '#F0E6FF', '#FFF0F5'
  ];

  return (
    <group ref={groupRef}>
      {[...Array(15)].map((_, i) => {
        const color = petalColors[i % petalColors.length];
        const position = [
          Math.cos((i / 15) * Math.PI * 2) * 3,
          Math.sin((i / 15) * Math.PI * 2) * 2,
          (Math.random() - 0.5) * 4
        ];
        const rotation = [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ];
        const scale = 0.5 + Math.random() * 0.5;

        return (
          <mesh 
            key={i}
            position={position as [number, number, number]}
            rotation={rotation as [number, number, number]}
            scale={scale}
          >
            <primitive object={petalGeometry.clone()} />
            <meshStandardMaterial
              color={color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingFlowers() {
  const flowersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!flowersRef.current) return;
    flowersRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  const createFlowerGeometry = () => {
    const group = new THREE.Group();
    const petalGeometry = new THREE.ShapeGeometry(
      new THREE.Shape()
        .moveTo(0, 0)
        .bezierCurveTo(0.2, 0.1, 0.4, 0.5, 0.2, 0.8)
        .bezierCurveTo(0, 1, -0.2, 1, -0.2, 0.6)
        .bezierCurveTo(-0.3, 0.3, -0.1, 0.1, 0, 0)
    );

    const petalMaterial = new THREE.MeshStandardMaterial({
      color: '#FFB6C1',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < 5; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial.clone());
      petal.rotation.z = (i / 5) * Math.PI * 2;
      petal.position.x = Math.cos((i / 5) * Math.PI * 2) * 0.3;
      petal.position.y = Math.sin((i / 5) * Math.PI * 2) * 0.3;
      group.add(petal);
    }

    // Center
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#FFD700' })
    );
    group.add(center);

    return group;
  };

  return (
    <group ref={flowersRef}>
      {[...Array(5)].map((_, i) => {
        const position = [
          Math.cos((i / 5) * Math.PI * 2) * 6,
          Math.sin((i / 5) * Math.PI * 2) * 3,
          (Math.random() - 0.5) * 6
        ];
        const scale = 0.8 + Math.random() * 0.4;

        return (
          <primitive 
            key={i}
            object={createFlowerGeometry()}
            position={position as [number, number, number]}
            scale={scale}
          />
        );
      })}
    </group>
  );
}

export default function ThreeHeaderAnimation() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 45 }}>
        <PerspectiveCamera makeDefault />
        <color attach="background" args={['#FFE4E6']} />
        
        <ambientLight intensity={0.6} color="#FFF0F5" />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#FFB6C1" />
        <pointLight position={[-10, -10, 10]} intensity={0.6} color="#DDA0DD" />
        <directionalLight position={[0, 10, 5]} intensity={0.5} color="#FFE4E6" />

        {/* Small floating petals */}
        <FlowerPetals />

        {/* Large decorative petals */}
        <LargePetals />

        {/* Floating flowers */}
        <FloatingFlowers />
      </Canvas>
    </div>
  );
}