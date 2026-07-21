'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const particleCount = 850;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color('#f59e0b'); // amber-500
    const colorB = new THREE.Color('#ec4899'); // pink-500
    const colorC = new THREE.Color('#fb923c'); // orange-400

    for (let i = 0; i < particleCount; i++) {
      // Slightly wider X/Y, deeper Z
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 24;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Gradient-ish mix
      const t = Math.random();
      const c = t < 0.33 ? colorA : t < 0.66 ? colorC : colorB;

      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if WebGL is supported
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      // Test if the browser supports WebGL
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, skipping ThreeBackground');
        return;
      }
      // If we got a context, clean up the test canvas
      const glContext = gl as WebGLRenderingContext;
      const ext = glContext.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext();
      }
    } catch (e) {
      console.warn('WebGL not available, skipping ThreeBackground:', e);
      return;
    }

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch (e) {
      console.warn('Failed to create WebGL renderer:', e);
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 42);

    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const light = new THREE.PointLight(0xffffff, 1);
    scene.add(light);

    el.appendChild(renderer.domElement);

    let raf = 0;
    const mouse = new THREE.Vector2(0, 0);
    let isDisposed = false;

    const onPointerMove = (ev: PointerEvent) => {
      if (isDisposed) return;
      const rect = el.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;
      mouse.x = (x - 0.5) * 2;
      mouse.y = (y - 0.5) * 2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      if (isDisposed || !renderer) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;

      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const tick = (t: number) => {
      if (isDisposed || !renderer) return;
      // animate
      const time = t * 0.001;

      // gentle rotation + parallax
      points.rotation.y = time * 0.25 + mouse.x * 0.2;
      points.rotation.x = Math.sin(time * 0.35) * 0.06 + mouse.y * 0.15;

      // wave motion by moving positions slightly
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const x0 = posAttr.array[ix + 0];
        const y0 = posAttr.array[ix + 1];
        const z0 = posAttr.array[ix + 2];

        // create a smooth drift field
        posAttr.array[ix + 0] = x0 + Math.sin(time + i * 0.03) * 0.0025;
        posAttr.array[ix + 1] = y0 + Math.cos(time * 1.1 + i * 0.025) * 0.002;
        posAttr.array[ix + 2] = z0 + Math.sin(time * 0.7 + i * 0.02) * 0.002;
      }
      posAttr.needsUpdate = true;

      try {
        renderer.render(scene, camera);
      } catch (e) {
        console.warn('ThreeBackground render error:', e);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => resize());
    ro.observe(el);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (renderer) {
        renderer.dispose();
      }
      el.innerHTML = '';
    };
  }, [geometry]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 ${className}`}
      aria-hidden
      style={{ pointerEvents: 'none' }}
    />

  );
}

