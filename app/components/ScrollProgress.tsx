'use client';
import { useScrollProgress } from '../hooks/useScrollProgress';

/** Renders inside <SiteNav> on pages that want a reading-progress underbar. */
export function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      className="absolute bottom-0 left-0 h-px bg-accent origin-left transition-[width] duration-75"
      style={{ width: `${p * 100}%` }}
    />
  );
}
