'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FooterThreeAnimation() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;

    // Check if WebGL is supported
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, skipping FooterThreeAnimation');
        return;
      }
      const glContext = gl as WebGLRenderingContext;
      const ext = glContext.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext();
      }
    } catch (e) {
      console.warn('WebGL not available, skipping FooterThreeAnimation:', e);
      return;
    }

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      host.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('Failed to create WebGL renderer for FooterThreeAnimation:', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 60;

    // Flower colors
    const flowerColors = [
      new THREE.Color('#C4705B'), // Terracotta
      new THREE.Color('#D4A574'), // Gold
      new THREE.Color('#8B3A3A'), // Deep brown
      new THREE.Color('#D4C4B5'), // Light beige
      new THREE.Color('#E8DFD3'), // Soft cream
    ];

    // Create flower petals
    const petals: THREE.Mesh[] = [];
    const flowerCount = 8;

    for (let f = 0; f < flowerCount; f++) {
      const flowerGroup = new THREE.Group();
      
      // Random position
      flowerGroup.position.x = (Math.random() - 0.5) * 100;
      flowerGroup.position.y = (Math.random() - 0.5) * 30;
      flowerGroup.position.z = (Math.random() - 0.5) * 20;
      
      // Random scale
      const scale = 0.5 + Math.random() * 1.5;
      flowerGroup.scale.set(scale, scale, scale);
      
      // Random rotation
      flowerGroup.rotation.z = Math.random() * Math.PI * 2;
      
      const petalCount = 5 + Math.floor(Math.random() * 4);
      const petalColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      
      for (let p = 0; p < petalCount; p++) {
        // Create petal shape using curved geometry
        const petalGeometry = new THREE.Shape();
        petalGeometry.moveTo(0, 0);
        petalGeometry.quadraticCurveTo(0.5, 0.3, 1, 0);
        petalGeometry.quadraticCurveTo(0.5, -0.3, 0, 0);
        
        const extrudeSettings = {
          steps: 1,
          depth: 0.05,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 3
        };
        
        const petalMeshGeometry = new THREE.ExtrudeGeometry(petalGeometry, extrudeSettings);
        const petalMaterial = new THREE.MeshBasicMaterial({
          color: petalColor,
          transparent: true,
          opacity: 0.6 + Math.random() * 0.3,
          side: THREE.DoubleSide
        });
        
        const petal = new THREE.Mesh(petalMeshGeometry, petalMaterial);
        
        // Position petal around center
        const angle = (p / petalCount) * Math.PI * 2;
        petal.position.x = Math.cos(angle) * 0.3;
        petal.position.y = Math.sin(angle) * 0.3;
        petal.rotation.z = angle;
        
        flowerGroup.add(petal);
        petals.push(petal);
      }
      
      // Add center
      const centerGeometry = new THREE.CircleGeometry(0.15, 16);
      const centerMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#8A4A32'),
        transparent: true,
        opacity: 0.8
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      flowerGroup.add(center);
      
      scene.add(flowerGroup);
    }

    // Add floating particles
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 120;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
      
      particleSizes[i] = 0.5 + Math.random() * 1.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let raf = 0;
    let startTime = Date.now();
    let isDisposed = false;

    const onResize = () => {
      if (isDisposed || !renderer) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    const animate = () => {
      if (isDisposed || !renderer) return;
      const t = (Date.now() - startTime) / 1000;

      // Animate flower petals (blooming effect)
      petals.forEach((petal, index) => {
        const bloomPhase = t * 0.5 + index * 0.1;
        const scale = 1 + Math.sin(bloomPhase) * 0.2;
        petal.scale.set(scale, scale, scale);
        petal.rotation.z += 0.01;
      });

      // Rotate entire scene slowly
      scene.rotation.y = t * 0.05;
      scene.rotation.x = Math.sin(t * 0.2) * 0.05;

      // Animate particles
      particles.rotation.y = t * 0.03;
      particles.rotation.x = Math.sin(t * 0.3) * 0.02;
      particleMaterial.opacity = 0.4 + Math.sin(t * 0.5) * 0.15;

      // Gentle floating motion
      scene.position.y = Math.sin(t * 0.4) * 0.5;

      try {
        renderer.render(scene, camera);
      } catch (e) {
        console.warn('FooterThreeAnimation render error:', e);
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      
      // Dispose geometries and materials
      petals.forEach(petal => {
        if (petal.geometry) petal.geometry.dispose();
        if (petal.material) {
          if (Array.isArray(petal.material)) {
            petal.material.forEach(m => m.dispose());
          } else {
            petal.material.dispose();
          }
        }
      });
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      scene.clear();
      
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    />
  );
}

