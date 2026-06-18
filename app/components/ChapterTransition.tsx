'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Particle system                                                    */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 60;

function Particles({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useRef(new THREE.Object3D());
  const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const startTime = useRef(0);
  const opacity = useRef(1);

  useEffect(() => {
    if (!meshRef.current || reducedMotion) return;
    startTime.current = performance.now() / 1000;

    // Random initial positions in a scattered pattern
    const mat = meshRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      dummy.current.scale.setScalar(0.015 + Math.random() * 0.025);
      dummy.current.updateMatrix();
      mat.setMatrixAt(i, dummy.current.matrix);

      // Random velocities for dispersal
      velocities.current[i * 3] = (Math.random() - 0.5) * 2;
      velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 2;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }
    mat.instanceMatrix.needsUpdate = true;
  }, [active, reducedMotion]);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;

    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 1.5;
    const t = Math.min(elapsed / duration, 1);

    // Fade curve: quick in, hold, quick out
    if (t < 0.1) {
      opacity.current = t / 0.1; // fade in
    } else if (t > 0.9) {
      opacity.current = (1 - t) / 0.1; // fade out
    } else {
      opacity.current = 1;
    }

    const mat = meshRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Phase 1 (0-0.4): disperse
      // Phase 2 (0.4-0.6): hold
      // Phase 3 (0.6-1.0): reassemble
      const phase = t < 0.4 ? t / 0.4 : t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;

      const vx = velocities.current[i * 3] * (1 - phase);
      const vy = velocities.current[i * 3 + 1] * (1 - phase);
      const vz = velocities.current[i * 3 + 2] * (1 - phase);

      dummy.current.position.x += vx * 0.02;
      dummy.current.position.y += vy * 0.02;
      dummy.current.position.z += vz * 0.02;

      // Size pulses slightly
      const s = (0.015 + Math.random() * 0.01) * (0.5 + 0.5 * Math.sin(elapsed * 4 + i));
      dummy.current.scale.setScalar(s);
      dummy.current.updateMatrix();
      mat.setMatrixAt(i, dummy.current.matrix);
    }
    mat.instanceMatrix.needsUpdate = true;

    // Update material opacity
    if (mat.material instanceof THREE.MeshBasicMaterial) {
      mat.material.opacity = opacity.current * 0.5;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.5, 6, 6]} />
      <meshBasicMaterial
        color="#00d4aa"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene (only renders when active)                                   */
/* ------------------------------------------------------------------ */

function TransitionScene({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={1} />
      <Particles active={active} reducedMotion={reducedMotion} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export interface ChapterTransitionProps {
  activeChapter: string;
}

export function ChapterTransition({ activeChapter }: ChapterTransitionProps) {
  const [show, setShow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevChapterRef = useRef(activeChapter);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Don't trigger on initial mount
    if (prevChapterRef.current === activeChapter) return;
    if (reducedMotion) {
      prevChapterRef.current = activeChapter;
      return;
    }

    prevChapterRef.current = activeChapter;
    setShow(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShow(false);
    }, 1600); // slightly longer than animation duration

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeChapter, reducedMotion]);

  if (!show || reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      <Canvas
        gl={{ alpha: true, antialias: false }}
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <TransitionScene active={show} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
