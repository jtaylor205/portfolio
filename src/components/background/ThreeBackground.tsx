'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SEGS = 64;
const SIZE = 26;

function FluidSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { basePositions, geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    const pos = geo.attributes.position;
    const basePositions = new Float32Array(pos.array.length);
    basePositions.set(pos.array as Float32Array);
    return { basePositions, geometry: geo };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime() * 0.5;
    const pos = geometry.attributes.position.array as Float32Array;
    const base = basePositions;

    // Simple but more pronounced unified wave — still no noise/distortion
    const amplitude = 2.4;
    const frequency = 0.4;

    materialRef.current.opacity = 0.28;

    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      
      // Base wave pattern only
      const wave = Math.sin(x * frequency + t) * Math.cos(y * 0.32 + t * 0.9);
      const roll = Math.sin((x + y) * 0.16 + t * 0.6) * 0.6;

      pos[i + 2] = (wave + roll) * amplitude;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.35, 0, 0]}
      position={[0, 0, -5]}
      geometry={geometry}
    >
      <meshBasicMaterial
        ref={materialRef}
        color="#a5b4fc"
        transparent
        opacity={0.28}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
     
      <FluidSurface />
    </>
  );
}

const R3FCanvas = dynamic(
  () =>
    import('@react-three/fiber').then((mod) => {
      const Canvas = mod.Canvas;
      return function CanvasWrapper() {
        return (
          <Canvas
            camera={{ position: [0, 0, 14], fov: 52 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'low-power',
            }}
            dpr={[1, 1.5]}
            style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
          >
            <Scene />
          </Canvas>
        );
      };
    }),
  { ssr: false }
);

export default function ThreeBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="fixed inset-0 z-[-1] bg-[#050a23] [background-image:radial-gradient(circle_at_top_left,rgba(56,189,248,0.55),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.7),transparent_65%)]"
      aria-hidden
    >
      <R3FCanvas />
    </motion.div>
  );
}
