// Tests the fire card: fields, the allow-listed link, hostile text as text, and the action callbacks.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Fire } from '@/entities/fire';

import { FireDetailsCard } from './fire-details-card';

const FIRE: Fire = {
  fireNumber: 'K52001',
  incidentName: 'McDougall Creek',
  status: 'Out of Control',
  rawStatus: 'Out of Control',
  isFireOfNote: true,
  sizeHa: 13_970,
  ignitionDateMs: Date.UTC(2025, 7, 15, 22, 20),
  location: 'West Kelowna',
  cause: 'Lightning',
  incidentUrl: 'https://wildfiresituation.nrs.gov.bc.ca/incidents?incidentNumber=K52001',
  lng: -119.6,
  lat: 49.9,
};

// Renders the card with spy callbacks and returns them.
function renderCard(fire: Fire) {
  const onClose = vi.fn();
  const onFlyHere = vi.fn();
  render(
    <FireDetailsCard
      fire={fire}
      fetchedAtMs={Date.UTC(2026, 10, 4)}
      onClose={onClose}
      onFlyHere={onFlyHere}
    />,
  );
  return { onClose, onFlyHere };
}

describe('FireDetailsCard', () => {
  it('shows the fire fields, status text and the source disclaimer', () => {
    renderCard(FIRE);
    expect(screen.getByRole('heading', { name: 'McDougall Creek' })).toBeInTheDocument();
    expect(screen.getByText('Fire K52001')).toBeInTheDocument();
    expect(screen.getByText('Out of Control')).toBeInTheDocument();
    expect(screen.getByText('13,970 ha')).toBeInTheDocument();
    expect(
      screen.getByText(/Informational only\. Source: BC Wildfire Service open data/),
    ).toBeInTheDocument();
  });

  it('links to BCWS in a new tab without opener or referrer', () => {
    renderCard(FIRE);
    const link = screen.getByRole('link', { name: /Open on BC Wildfire Service/ });
    expect(link).toHaveAttribute('href', FIRE.incidentUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the link when the URL was not allow-listed and renders hostile text as text', () => {
    renderCard({ ...FIRE, incidentUrl: null, incidentName: '<img src=x onerror=alert(1)>' });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '<img src=x onerror=alert(1)>' }),
    ).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('calls back for Fly here and Close', async () => {
    const { onClose, onFlyHere } = renderCard(FIRE);
    await userEvent.click(screen.getByRole('button', { name: 'Fly here' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close fire details' }));
    expect(onFlyHere).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
