import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PullQuote } from './PullQuote';

describe('PullQuote', () => {
  it('renders quote and optional citation', () => {
    render(<PullQuote citation="Iman Mersal">Archives are not neutral.</PullQuote>);
    expect(screen.getByText(/Archives are not neutral/)).toBeInTheDocument();
    expect(screen.getByText(/Iman Mersal/)).toBeInTheDocument();
  });

  it('renders without citation when omitted', () => {
    render(<PullQuote>x</PullQuote>);
    expect(screen.queryByRole('doc-cite')).not.toBeInTheDocument();
  });
});
