import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDnaEncoder } from './useDnaEncoder';

describe('useDnaEncoder', () => {
  it('returns null result for empty input', () => {
    const { result } = renderHook(() => useDnaEncoder('', 3));
    expect(result.current).toBeNull();
  });

  it('encodes simple text with d=3', () => {
    const { result } = renderHook(() => useDnaEncoder('Hi', 3));
    expect(result.current).not.toBeNull();
    expect(result.current!.ascii).toBe('Hi');
    expect(result.current!.blocks.length).toBeGreaterThan(0);
  });
});
