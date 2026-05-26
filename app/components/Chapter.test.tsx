import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chapter } from './Chapter';

describe('Chapter', () => {
  it('renders eyebrow, h2 title, body, and stable id anchor', () => {
    const { container } = render(
      <Chapter number={3} title="The Translation Problem" id="ch-3">
        <p>body paragraph</p>
      </Chapter>
    );
    expect(screen.getByText(/Chapter 03/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'The Translation Problem' })).toBeInTheDocument();
    expect(container.querySelector('section')?.id).toBe('ch-3');
    expect(screen.getByText('body paragraph')).toBeInTheDocument();
  });
});
