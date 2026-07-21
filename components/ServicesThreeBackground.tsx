'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function ServicesThreeBackground({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  const config = useMemo(
    () => ({
      count: 900,
      boundsX: 220,
      boundsY: 140,
      boundsZ: 60,
    }),
    []
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(1, host.clientWidth / host.clientHeight),
      0.1,
      1000
    );
    camera.position.set(0, 0, 140);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);

    const colorA = new THREE.Color('#C4705B'); // rose
    const colorB = new THREE.Color('#8A4A32'); // brown
    const colorC = new THREE.Color('#D4C4B5'); // sand
    const colorD = new THREE.Color('#F59E0B'); // amber

    const pickColor = (t: number) => (t < 0.25 ? colorA : t < 0.5 ? colorD : t < 0.75 ? colorC : colorB);

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * config.boundsX;
      const y = (Math.random() - 0.5) * config.boundsY;
      const z = (Math.random() - 0.5) * config.boundsZ;

      positions[i3 + 0] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const t = Math.random();
      const c = pickColor(t);
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    renderer.setSize(host.clientWidth, host.clientHeight, false);
    host.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);

    const onPointerMove = (ev: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;
      mouse.x = (x - 0.5) * 2;
      mouse.y = (y - 0.5) * 2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();

      // parallax + orbit
      points.rotation.y = t * 0.08 + mouse.x * 0.15;
      points.rotation.x = Math.sin(t * 0.22) * 0.06 + mouse.y * 0.1;

      // subtle waves
      for (let i = 0; i < config.count; i++) {
        const ix = i * 3;
        const x0 = posAttr.array[ix + 0];
        const y0 = posAttr.array[ix + 1];
        const z0 = posAttr.array[ix + 2];

        posAttr.array[ix + 0] = x0 + Math.sin(t + i * 0.03) * 0.06;
        posAttr.array[ix + 1] = y0 + Math.cos(t * 1.1 + i * 0.02) * 0.05;
        posAttr.array[ix + 2] = z0 + Math.sin(t * 0.7 + i * 0.015) * 0.04;
      }
      posAttr.needsUpdate = true;

      material.opacity = 0.28 + (Math.sin(t * 0.6) * 0.08 + 0.08);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      material.dispose();
      scene.clear();

      renderer.dispose();
      if (renderer.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [config.count]);

  return (
    <div
      ref={hostRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    />
  );
}

