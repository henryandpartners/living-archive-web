import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveChapter } from './useActiveChapter';

class MockIntersectionObserver {
  private cb: IntersectionObserverCallback;
  static instances: MockIntersectionObserver[] = [];
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    MockIntersectionObserver.instances.push(this);
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  fire(entries: Array<{ target: Element; isIntersecting: boolean }>) {
    this.cb(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }
}

describe('useActiveChapter', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
    document.body.innerHTML = `
      <section id="ch-1"></section>
      <section id="ch-2"></section>
      <section id="ch-3"></section>
    `;
  });

  it('starts with the first id as active', () => {
    const { result } = renderHook(() => useActiveChapter(['ch-1', 'ch-2', 'ch-3']));
    expect(result.current).toBe('ch-1');
  });

  it('updates when an entry intersects', () => {
    const { result } = renderHook(() => useActiveChapter(['ch-1', 'ch-2', 'ch-3']));
    const obs = MockIntersectionObserver.instances[0];
    act(() => {
      obs.fire([{ target: document.getElementById('ch-2')!, isIntersecting: true }]);
    });
    expect(result.current).toBe('ch-2');
  });
});
