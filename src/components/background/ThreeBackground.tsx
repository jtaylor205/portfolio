'use client';

import dynamic from 'next/dynamic';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SEGS = 64;
const SIZE = 26;

function FluidSurface({ scrollProgress }: { scrollProgress: number }) {
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

    // Increase chaos/distortion based on scroll
    const chaos = scrollProgress * 3; // 0 to 3 multiplier
    const amplitude = 2.2 + scrollProgress * 1.5; // Increase wave height
    const frequency = 0.35 + scrollProgress * 0.2; // Increase wave frequency

    // Fade opacity as scroll increases (from 0.28 to 0)
    materialRef.current.opacity = 0.28 * (1 - scrollProgress);

    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      
      // Base wave pattern
      const wave = Math.sin(x * frequency + t) * Math.cos(y * 0.3 + t * 0.85);
      const roll = Math.sin((x + y) * 0.15 + t * 0.6) * 0.5;
      
      // Add chaotic distortion as you scroll
      const distortion = chaos > 0 ? 
        Math.sin(x * 0.8 + t * 1.2 + scrollProgress * 10) * 
        Math.cos(y * 0.7 + t * 0.9 + scrollProgress * 8) * chaos * 0.4 : 0;
      
      // Add random noise-like breakup
      const breakup = chaos > 0.3 ?
        Math.sin(x * 2.5 + y * 1.8 + t * 2) * 
        Math.cos(x * 1.2 - y * 2.1 + t * 1.5) * (chaos - 0.3) * 0.6 : 0;
      
      pos[i + 2] = (wave + roll + distortion + breakup) * amplitude;
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

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#0d0b14']} />
      <FluidSurface scrollProgress={scrollProgress} />
    </>
  );
}

const R3FCanvas = dynamic(
  () =>
    import('@react-three/fiber').then((mod) => {
      const Canvas = mod.Canvas;
      return function CanvasWrapper({ scrollProgress }: { scrollProgress: number }) {
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
            <Scene scrollProgress={scrollProgress} />
          </Canvas>
        );
      };
    }),
  { ssr: false }
);

export default function ThreeBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate progress based on home section height (first section)
      const homeSection = document.getElementById('home');
      if (!homeSection) return;
      
      const homeHeight = homeSection.offsetHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / homeHeight, 1); // 0 to 1 within home section
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[-1] bg-[#0d0b14] [background-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),transparent),radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(139,92,246,0.08),transparent)]"
      aria-hidden
    >
      <R3FCanvas scrollProgress={scrollProgress} />
    </div>
  );
}
