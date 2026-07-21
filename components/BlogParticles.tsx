'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BlogParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle system using standard materials
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Hair salon color palette
    const colors = [
      new THREE.Color('#C4705B'), // Terracotta
      new THREE.Color('#8A4A32'), // Brown
      new THREE.Color('#7F1D1D'), // Deep red
      new THREE.Color('#D4A574'), // Light brown
      new THREE.Color('#F7F1EC'), // Cream
    ];

    for (let i = 0; i < particlesCount; i++) {
      // Position
      posArray[i * 3] = (Math.random() - 0.5) * 25;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 25;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      // Color
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Use standard PointsMaterial instead of custom shader
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating strands (hair-like curves)
    const strandsGeometry = new THREE.BufferGeometry();
    const strandsCount = 30;
    const strandPoints = 15;
    
    const strandPositions = new Float32Array(strandsCount * strandPoints * 3);
    const strandColors = new Float32Array(strandsCount * strandPoints * 3);
    
    for (let i = 0; i < strandsCount; i++) {
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 20;
      const startZ = (Math.random() - 0.5) * 10 - 5;
      
      const strandColor = colors[Math.floor(Math.random() * colors.length)];
      
      for (let j = 0; j < strandPoints; j++) {
        const t = j / (strandPoints - 1);
        const index = (i * strandPoints + j) * 3;
        
        strandPositions[index] = startX + Math.sin(t * Math.PI * 2 + i) * 0.5;
        strandPositions[index + 1] = startY - t * 3;
        strandPositions[index + 2] = startZ + Math.cos(t * Math.PI * 2 + i) * 0.5;
        
        strandColors[index] = strandColor.r;
        strandColors[index + 1] = strandColor.g;
        strandColors[index + 2] = strandColor.b;
      }
    }
    
    strandsGeometry.setAttribute('position', new THREE.BufferAttribute(strandPositions, 3));
    strandsGeometry.setAttribute('color', new THREE.BufferAttribute(strandColors, 3));
    
    const strandsMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const strandsMesh = new THREE.LineSegments(
      new THREE.BufferGeometry().copy(strandsGeometry),
      strandsMaterial
    );
    scene.add(strandsMesh);

    camera.position.z = 10;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Animate particle positions for floating effect
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        // Add gentle floating motion
        positions[i3 + 1] = y + Math.sin(elapsedTime * 0.5 + x * 0.5) * 0.002;
        positions[i3] = x + Math.cos(elapsedTime * 0.3 + y * 0.3) * 0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      
      // Rotate entire system slowly
      particlesMesh.rotation.y = elapsedTime * 0.02;
      particlesMesh.rotation.x = elapsedTime * 0.01;
      
      strandsMesh.rotation.y = elapsedTime * 0.015;
      strandsMesh.rotation.x = elapsedTime * 0.008;
      
      // Mouse interaction
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      strandsGeometry.dispose();
      strandsMaterial.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}