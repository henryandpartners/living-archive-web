import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders children', () => {
    render(<Callout>Important note about the fish.</Callout>);
    expect(screen.getByText('Important note about the fish.')).toBeInTheDocument();
  });

  it('uses an aside element with role="note"', () => {
    render(<Callout>x</Callout>);
    expect(screen.getByRole('note')).toBeInTheDocument();
  });
});
