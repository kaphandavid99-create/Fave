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
    camera.position.z = 80;

    // points
    const count = 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color('#7F1D1D');
    const colorB = new THREE.Color('#C4705B');
    const colorC = new THREE.Color('#D4C4B5');
    const colorsPool = [colorA, colorB, colorC];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const c = colorsPool[Math.floor(Math.random() * colorsPool.length)];
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf = 0;
    const clock = new THREE.Clock();
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
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.12;
      points.rotation.x = Math.sin(t * 0.4) * 0.06;
      material.opacity = 0.45 + Math.sin(t * 0.7) * 0.12;

      // float
      points.position.y = Math.sin(t * 0.6) * 1.2;

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
      geometry.dispose();
      material.dispose();
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

