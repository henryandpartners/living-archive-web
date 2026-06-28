import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DnaSequence } from './DnaSequence';

describe('DnaSequence', () => {
  it('wraps each nucleotide in a span with the matching base-X class', () => {
    const { container } = render(<DnaSequence sequence="ACGT" />);
    const baseSpans = container.querySelectorAll('span.base-A, span.base-C, span.base-G, span.base-T');
    expect(baseSpans).toHaveLength(4);
    expect(baseSpans[0].className).toContain('base-A');
    expect(baseSpans[1].className).toContain('base-C');
    expect(baseSpans[2].className).toContain('base-G');
    expect(baseSpans[3].className).toContain('base-T');
  });

  it('truncates and shows ellipsis when maxLength is set', () => {
    const { container } = render(<DnaSequence sequence="ACGTACGT" maxLength={4} />);
    expect(container.textContent).toBe('ACGT…');
  });
});
