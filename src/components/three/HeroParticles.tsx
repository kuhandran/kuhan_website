'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation — comes from R3F internals, not our code
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
    _warn(...args);
  };
}

const PARTICLE_COUNT = 280;

// ── Generated at module load, not during render ─────────────────────────────
// React 19 flags Math.random() as impure when called inside useMemo/render.
// Moving here runs it once at import time — deterministic from React's view.
const PARTICLE_POSITIONS = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 24;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  return arr;
})();

const PARTICLE_COLORS = (() => {
  const palette = [
    new THREE.Color('#60a5fa'), // blue-400
    new THREE.Color('#a78bfa'), // violet-400
    new THREE.Color('#34d399'), // emerald-400
    new THREE.Color('#f8fafc'), // white-ish
  ];
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const c = palette[Math.floor(Math.random() * palette.length)];
    arr[i * 3]     = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  return arr;
})();

// ── Component ────────────────────────────────────────────────────────────────

function ParticleField() {
  const points  = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!points.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    points.current.rotation.y = t * 0.04;
    points.current.rotation.x = Math.sin(t * 0.025) * 0.12;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
        <bufferAttribute attach="attributes-color"    args={[PARTICLE_COLORS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

export function HeroParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
