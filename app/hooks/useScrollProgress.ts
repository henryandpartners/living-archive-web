'use client';
import { useEffect, useState } from 'react';

/** Returns a value in [0, 1] representing how far down the page the viewport is. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const raw = el.scrollTop / scrollable;
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return progress;
}
