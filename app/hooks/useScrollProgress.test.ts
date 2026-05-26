import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollProgress } from './useScrollProgress';

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, writable: true, value: 0 });
  });

  it('returns 0 at the top', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('returns ~0.5 when scrolled halfway', () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      (document.documentElement as unknown as { scrollTop: number }).scrollTop = 600;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBeCloseTo(0.5, 1);
  });

  it('caps at 1 when scrolled past the end', () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      (document.documentElement as unknown as { scrollTop: number }).scrollTop = 9999;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(1);
  });
});
