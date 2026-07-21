'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ServicesParticles() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const host = hostRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    // Soft lighting / background
    const geometry = new THREE.BufferGeometry();

    const count = 650;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color('#C4705B');
    const colorB = new THREE.Color('#8A4A32');
    const colorC = new THREE.Color('#D4C4B5');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // spread
      positions[i3 + 0] = (Math.random() - 0.5) * 180;
      positions[i3 + 1] = (Math.random() - 0.5) * 110;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const t = Math.random();
      const c = t < 0.33 ? colorA : t < 0.66 ? colorB : colorC;

      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // subtle rotation + float
    let frame = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      if (!host) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    const animate = () => {
      frame++;
      const t = clock.getElapsedTime();

      points.rotation.y = t * 0.08;
      points.rotation.x = Math.sin(t * 0.25) * 0.06;

      // gentle breathing
      material.opacity = 0.32 + Math.sin(t * 0.7) * 0.1;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    />
  );
}

