'use client';
import { useMemo } from 'react';
import { encode, type EncodeResult } from '@/lib/dna';

export function useDnaEncoder(input: string, d: number): EncodeResult | null {
  return useMemo(() => {
    if (!input) return null;
    return encode(input, d);
  }, [input, d]);
}
