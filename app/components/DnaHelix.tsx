'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 500; // per strand
const STRANDS = 2;
const RADIUS = 1.4;
const HEIGHT = 5;
const TURNS = 3.5;
const PARTICLE_SIZE = 0.04;
const ACCENT_RATIO = 0.1; // fraction of particles that are green

/* ------------------------------------------------------------------ */
/*  DNA double helix (inner)                                       */
/* ------------------------------------------------------------------ */

interface HelixProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  reducedMotion: boolean;
}

function Helix({ mouseX, mouseY, scrollProgress, reducedMotion }: HelixProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const groupRef = useRef<THREE.Group>(null!);

  // Pre-compute positions & colors
  const { strand0, strand1 } = useMemo(() => {
    const s0: { pos: [number, number, number]; accent: boolean }[] = [];
    const s1: { pos: [number, number, number]; accent: boolean }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const y = (t - 0.5) * HEIGHT;
      const angle = t * Math.PI * 2 * TURNS;
      const x0 = Math.cos(angle) * RADIUS;
      const z0 = Math.sin(angle) * RADIUS;
      const x1 = Math.cos(angle + Math.PI) * RADIUS;
      const z1 = Math.sin(angle + Math.PI) * RADIUS;
      const accent = Math.random() < ACCENT_RATIO;
      s0.push({ pos: [x0, y, z0], accent });
      s1.push({ pos: [x1, y, z1], accent });
    }

    return { strand0: s0, strand1: s1 };
  }, []);

  // Build instanced mesh color array
  const totalParticles = PARTICLE_COUNT * 2;
  const instanceColors = useMemo(() => {
    const colors = new Float32Array(totalParticles * 3);
    const darkColor = new THREE.Color('#1a1a1a');
    const accentColor = new THREE.Color('#00d4aa');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c0 = strand0[i].accent ? accentColor : darkColor;
      const c1 = strand1[i].accent ? accentColor : darkColor;
      colors[i * 3] = c0.r;
      colors[i * 3 + 1] = c0.g;
      colors[i * 3 + 2] = c0.b;
      colors[(i + PARTICLE_COUNT) * 3] = c1.r;
      colors[(i + PARTICLE_COUNT) * 3 + 1] = c1.g;
      colors[(i + PARTICLE_COUNT) * 3 + 2] = c1.b;
    }
    return colors;
  }, [strand0, strand1]);

  // Scroll and mouse offsets (only in animation)
  const prevScroll = useRef(scrollProgress);
  const targetRotationY = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current || reducedMotion) return;

    const delta = state.clock.getDelta();
    const time = state.clock.getElapsedTime();

    // Slow auto-rotation
    const baseRotation = time * 0.1;

    // Scroll accelerates rotation
    const scrollDelta = scrollProgress - prevScroll.current;
    prevScroll.current = scrollProgress;
    targetRotationY.current += scrollDelta * 3;

    // Mouse drift ~5% effect
    const mouseOffsetX = mouseX * 0.3;
    const mouseOffsetY = mouseY * 0.15;

    // Damp toward target
    targetRotationY.current += (mouseOffsetX - targetRotationY.current) * 0.02;

    groupRef.current.rotation.y = baseRotation + targetRotationY.current;
    groupRef.current.rotation.x = mouseOffsetY;

    // Update instanced mesh with sinusoidal undulation
    for (let s = 0; s < 2; s++) {
      const strand = s === 0 ? strand0 : strand1;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = i / PARTICLE_COUNT;
        const baseY = (t - 0.5) * HEIGHT;
        const angle = t * Math.PI * 2 * TURNS;
        const phase = s === 0 ? 0 : Math.PI;

        // Undulation: sinusoidal Y displacement
        const undulation = Math.sin(time * 1.2 + t * Math.PI * 4) * 0.15;

        const x = strand[i].pos[0];
        const y = baseY + undulation;
        const z = strand[i].pos[2];

        dummy.position.set(x, y, z);
        dummy.scale.setScalar(PARTICLE_SIZE);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i + s * PARTICLE_COUNT, dummy.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Set initial positions
  useEffect(() => {
    if (!meshRef.current) return;
    for (let s = 0; s < 2; s++) {
      const strand = s === 0 ? strand0 : strand1;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        dummy.position.set(strand[i].pos[0], strand[i].pos[1], strand[i].pos[2]);
        dummy.scale.setScalar(PARTICLE_SIZE);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i + s * PARTICLE_COUNT, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [strand0, strand1, dummy]);

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, totalParticles]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial toneMapped={false}>
          <instancedBufferAttribute
            attach="instanceColor"
            args={[instanceColors, 3]}
          />
        </meshBasicMaterial>
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene wrapper — listens for pointer / resize / reduced-motion   */
/* ------------------------------------------------------------------ */

function Scene({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: number;
  reducedMotion: boolean;
}) {
  const { size, pointer } = useThree();

  // Convert normalized pointer (-1..1) to usable values
  const mouseX = pointer.x;
  const mouseY = pointer.y;

  return (
    <Helix
      mouseX={mouseX}
      mouseY={mouseY}
      scrollProgress={scrollProgress}
      reducedMotion={reducedMotion}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export interface DnaHelixProps {
  /** 0–1, from useScrollProgress or similar. */
  scrollProgress?: number;
}

export function DnaHelix({ scrollProgress = 0 }: DnaHelixProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.6, 5.5], fov: 48 }}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
    >
      <Scene scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/*  Static fallback for reduced motion                                 */
/* ------------------------------------------------------------------ */

export function DnaHelixStatic() {
  return (
    <div className="absolute inset-0 z-2 flex items-center justify-center pointer-events-none">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-w-[600px] opacity-60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 200 }).map((_, i) => {
          const t = i / 200;
          const y = t * 500;
          const angle = t * Math.PI * 2 * 3.5;
          const x1 = 200 + Math.cos(angle) * 120;
          const x2 = 200 + Math.cos(angle + Math.PI) * 120;
          const isAccent = i % 10 === 0;
          return (
            <g key={i}>
              <circle
                cx={x1}
                cy={y}
                r={2.5}
                fill={isAccent ? '#00d4aa' : '#1a1a1a'}
              />
              <circle
                cx={x2}
                cy={y}
                r={2.5}
                fill={isAccent ? '#00d4aa' : '#1a1a1a'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
