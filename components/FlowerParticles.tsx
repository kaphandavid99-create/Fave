'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FlowerParticle({ position, scale, rotation, color }: { position: [number, number, number], scale: number, rotation: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useRef(position[1]);
  const speed = useRef(0.15 + Math.random() * 0.25);
  const driftX = useRef((Math.random() - 0.5) * 0.8);
  const phase = useRef(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Complex rotation with multiple axes
      meshRef.current.rotation.z = rotation + time * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.2 + position[0] + phase.current) * 0.4;
      meshRef.current.rotation.y = Math.cos(time * 0.15 + position[1]) * 0.3;
      
      // Enhanced floating movement with multiple sine waves
      meshRef.current.position.y = initialY.current + 
        Math.sin(time * speed.current + position[0] + phase.current) * 1.5 +
        Math.sin(time * speed.current * 1.5) * 0.5;
      
      // Horizontal drift with variation
      meshRef.current.position.x = position[0] + 
        Math.sin(time * 0.15 + position[1] + phase.current) * driftX.current * 1.5 +
        Math.cos(time * 0.1) * 0.3;
      
      // Z movement for depth
      meshRef.current.position.z = position[2] + 
        Math.sin(time * 0.1 + position[2] + phase.current) * 0.8;
      
      // Scale pulsing
      const scalePulse = 1 + Math.sin(time * 0.5 + phase.current) * 0.1;
      meshRef.current.scale.set(scale * scalePulse, scale * scalePulse, scale * scalePulse);
    }
  });

  // Create more detailed flower shape
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const petals = 5 + Math.floor(Math.random() * 3); // Random petal count between 5-7
    const outerRadius = 0.5;
    const innerRadius = 0.12;
    
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const nextAngle = ((i + 1) / petals) * Math.PI * 2;
      const midAngle = (angle + nextAngle) / 2;
      
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(midAngle) * outerRadius * (1 + Math.random() * 0.2); // Slight variation
      const y2 = Math.sin(midAngle) * outerRadius * (1 + Math.random() * 0.2);
      const x3 = Math.cos(nextAngle) * innerRadius;
      const y3 = Math.sin(nextAngle) * innerRadius;
      
      if (i === 0) {
        shape.moveTo(x1, y1);
      }
      shape.quadraticCurveTo(x2, y2, x3, y3);
    }
    
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    });
  }, []);

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial 
        color={color}
        roughness={0.4}
        metalness={0.3}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SparkleParticle({ position, scale }: { position: [number, number, number], scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useRef(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.z = time * 2;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.3 + phase.current) * 0.5;
      const material = meshRef.current.material;
      if (material && !Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.5 + Math.sin(time * 1 + phase.current) * 0.3;
      }
    }
  });

  const geometry = useMemo(() => {
    return new THREE.OctahedronGeometry(0.15, 0);
  }, []);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial 
        color="#FFF"
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function FlowerParticles() {
  const particles = useMemo(() => {
    const count = 35;
    const particles = [];
    const colors = ['#F3D5D8', '#FFE4E9', '#FFB6C1', '#FFF0F5', '#FFC0CB'];
    
    for (let i = 0; i < count; i++) {
      particles.push({
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 12 - 4
        ] as [number, number, number],
        scale: 0.4 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    return particles;
  }, []);

  const sparkles = useMemo(() => {
    const count = 15;
    const sparkles = [];
    
    for (let i = 0; i < count; i++) {
      sparkles.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 15 - 5
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.3
      });
    }
    
    return sparkles;
  }, []);

  return (
    <>
      {particles.map((particle, index) => (
        <FlowerParticle
          key={index}
          position={particle.position}
          scale={particle.scale}
          rotation={particle.rotation}
          color={particle.color}
        />
      ))}
      {sparkles.map((sparkle, index) => (
        <SparkleParticle
          key={`sparkle-${index}`}
          position={sparkle.position}
          scale={sparkle.scale}
        />
      ))}
    </>
  );
}

export default function FlowerBackground({ limited = false }: { limited?: boolean }) {
  return (
    <div className={`pointer-events-none ${limited ? 'absolute inset-0' : 'fixed inset-0'}`} style={{ zIndex: -100 }}>
      <Canvas
        camera={{ position: [0, 0, limited ? 15 : 12], fov: limited ? 60 : 70 }}
        style={{ background: 'transparent', width: '100%', height: '100%', position: 'absolute' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 8, 8]} intensity={1.2} />
        <pointLight position={[-8, -8, -4]} intensity={0.8} color="#FFE4E9" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#F3D5D8" />
        <FlowerParticles />
      </Canvas>
    </div>
  );
}