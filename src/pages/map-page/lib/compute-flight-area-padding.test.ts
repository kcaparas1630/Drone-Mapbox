// Tests the camera padding that keeps the drone in the landscape cockpit's clear band.
import { describe, expect, it } from 'vitest';

import { getDroneDropRatio } from '@/entities/map-camera';

import { computeFlightAreaPadding } from './compute-flight-area-padding';

// Returns where the drone is drawn for a padding: centre of the padded view plus the drone drop.
function computeDroneYPx(heightPx: number, padding: { topPx: number; bottomPx: number }): number {
  return (heightPx + padding.topPx - padding.bottomPx) / 2 + getDroneDropRatio() * heightPx;
}

describe('computeFlightAreaPadding', () => {
  it('lifts the drone three quarters down the band on a short landscape phone', () => {
    const padding = computeFlightAreaPadding(
      { top: 0, bottom: 271 },
      { top: 8, bottom: 54 },
      { top: 158, bottom: 263 },
    );
    expect(padding.topPx).toBe(0);
    expect(padding.bottomPx).toBe(130);
    expect(computeDroneYPx(271, padding)).toBeCloseTo(54 + 104 * 0.75, 0);
  });

  it('measures from an overlay that does not start at the top of the window', () => {
    const padding = computeFlightAreaPadding(
      { top: 100, bottom: 371 },
      { top: 108, bottom: 154 },
      { top: 258, bottom: 363 },
    );
    expect(padding).toEqual({ topPx: 0, bottomPx: 130 });
  });

  it('pads the top instead when the band sits low in a tall view', () => {
    const padding = computeFlightAreaPadding(
      { top: 0, bottom: 1000 },
      { top: 0, bottom: 600 },
      { top: 980, bottom: 1000 },
    );
    expect(padding.bottomPx).toBe(0);
    expect(padding.topPx).toBeGreaterThan(0);
    expect(computeDroneYPx(1000, padding)).toBeCloseTo(600 + 380 * 0.75, 0);
  });

  it('drops the padding when the bars leave no band between them', () => {
    const padding = computeFlightAreaPadding(
      { top: 0, bottom: 100 },
      { top: 0, bottom: 60 },
      { top: 40, bottom: 100 },
    );
    expect(padding).toEqual({ topPx: 0, bottomPx: 0 });
  });
});
