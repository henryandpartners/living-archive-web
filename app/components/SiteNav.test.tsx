import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('renders the wordmark and three nav links', () => {
    render(<SiteNav pathname="/" />);
    expect(screen.getByText('Living Archive')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('href', '/pipeline');
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/publications');
  });

  it('marks the Story link as current when on /', () => {
    render(<SiteNav pathname="/" />);
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Pipeline' })).not.toHaveAttribute('aria-current');
  });

  it('marks the Pipeline link as current on /pipeline', () => {
    render(<SiteNav pathname="/pipeline" />);
    expect(screen.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks the Publications link as current on /publications/leonardo', () => {
    render(<SiteNav pathname="/publications/leonardo" />);
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('aria-current', 'page');
  });
});
