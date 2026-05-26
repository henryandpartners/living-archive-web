import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChapterRail } from './ChapterRail';

const CHAPTERS = [
  { id: 'ch-1', number: 1, title: 'Problem' },
  { id: 'ch-2', number: 2, title: 'Medium' },
  { id: 'ch-3', number: 3, title: 'Translation' },
];

describe('ChapterRail', () => {
  it('renders one item per chapter with the title and padded number', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-1" />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('Problem')).toBeInTheDocument();
  });

  it('marks the active chapter with aria-current', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-2" />);
    const active = screen.getByRole('link', { name: /02.*Medium/i });
    expect(active).toHaveAttribute('aria-current', 'true');
  });

  it('renders each item as an anchor link to the chapter id', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-1" />);
    expect(screen.getByRole('link', { name: /01.*Problem/i })).toHaveAttribute('href', '#ch-1');
  });
});
