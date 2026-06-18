'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Color mapping by base                                               */
/* ------------------------------------------------------------------ */

const BASE_COLORS: Record<string, string> = {
  A: '#00d4aa',
  C: '#4aa0ff',
  G: '#ffaa00',
  T: '#ff4455',
};

/* ------------------------------------------------------------------ */
/*  Animated single strand                                              */
/* ------------------------------------------------------------------ */

interface StrandProps {
  dna: string;
  reducedMotion: boolean;
}

function Strand({ dna, reducedMotion }: StrandProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = Math.min(dna.length, 300);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const base = dna[i] || 'A';
      const color = new THREE.Color(BASE_COLORS[base] || '#00d4aa');
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [dna, count]);

  // Initial positions
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * 2;
      const radius = 0.6;
      const x = Math.cos(angle) * radius;
      const y = (t - 0.5) * 1.5;
      const z = Math.sin(angle) * radius;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * 2 + time * 0.3;
      const radius = 0.6 + Math.sin(time * 1.5 + t * 8) * 0.05;
      const x = Math.cos(angle) * radius;
      const y = (t - 0.5) * 1.5 + Math.sin(time * 0.8 + t * 6) * 0.06;
      const z = Math.sin(angle) * radius;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false}>
        <instancedBufferAttribute
          attach="instanceColor"
          args={[colors, 3]}
        />
      </meshBasicMaterial>
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Static fallback (colored circles)                                   */
/* ------------------------------------------------------------------ */

function StaticDnaCircles({ dna }: { dna: string }) {
  const display = dna.slice(0, 60);
  return (
    <div className="flex flex-wrap gap-1 justify-center py-4">
      {display.split('').map((base, i) => (
        <span
          key={i}
          className="inline-block w-3.5 h-3.5 rounded-full"
          style={{
            backgroundColor: BASE_COLORS[base] || '#00d4aa',
            opacity: 0.85,
          }}
          title={`${base} — pos ${i}`}
        />
      ))}
      {dna.length > 60 && (
        <span className="text-text-faint text-xs ml-1 self-center" style={{ fontFamily: 'var(--font-mono)' }}>
          +{dna.length - 60} more
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export interface PipelineDnaVizProps {
  dna: string;
}

export function PipelineDnaViz({ dna }: PipelineDnaVizProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!dna) return null;

  if (reducedMotion) {
    return (
      <div className="mt-6 p-4 border border-border bg-bg-elev">
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          DNA Strand Visualization
        </p>
        <StaticDnaCircles dna={dna} />
      </div>
    );
  }

  return (
    <div className="mt-6 border border-border bg-bg-elev" style={{ height: 200 }}>
      <p
        className="absolute mt-2 ml-3 text-[10px] tracking-[0.2em] uppercase text-text-faint z-10 pointer-events-none"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        DNA Strand Visualization
      </p>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.2, 2], fov: 40 }}
        style={{ width: '100%', height: 200 }}
      >
        <ambientLight intensity={1} />
        <Strand dna={dna} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
