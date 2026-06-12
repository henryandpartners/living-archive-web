import { describe, it, expect } from 'vitest';
import { CHAPTERS } from './chapters';

describe('chapters data', () => {
  it('has exactly 9 chapters with sequential numbers 1..9', () => {
    expect(CHAPTERS).toHaveLength(9);
    CHAPTERS.forEach((c, i) => expect(c.number).toBe(i + 1));
  });

  it('every chapter has unique id, title, short, and a render function', () => {
    const ids = new Set(CHAPTERS.map((c) => c.id));
    expect(ids.size).toBe(9);
    CHAPTERS.forEach((c) => {
      expect(c.title).toBeTruthy();
      expect(c.short).toBeTruthy();
      expect(typeof c.render).toBe('function');
    });
  });
});
