// Tests the BC soft clamp: free movement inside, damped outward motion near edges, never outside.
import { describe, expect, it } from 'vitest';

import { createSimWorld } from '../model/sim-world';
import { clampToBritishColumbia } from './clamp-to-british-columbia';

// Builds a world whose last step moved from (fromLng, fromLat) to (toLng, toLat).
function buildMovedWorld(fromLng: number, fromLat: number, toLng: number, toLat: number) {
  const world = createSimWorld({ lng: toLng, lat: toLat, altitudeMsl: 1000, headingRad: 0 });
  world.previousLng = fromLng;
  world.previousLat = fromLat;
  return world;
}

describe('clampToBritishColumbia', () => {
  it('leaves movement far from the edges untouched', () => {
    const world = buildMovedWorld(-122.75, 53.92, -122.74, 53.93);
    clampToBritishColumbia(world);
    expect(world.lng).toBeCloseTo(-122.74, 12);
    expect(world.lat).toBeCloseTo(53.93, 12);
    expect(world.isAtBcEdge).toBe(false);
  });

  it('damps northward motion about halfway through the 5 km zone at 60° N', () => {
    const world = buildMovedWorld(-125, 59.9775, -125, 59.9785);
    clampToBritishColumbia(world);
    const allowedStep = world.lat - 59.9775;
    expect(allowedStep / 0.001).toBeCloseTo(0.5, 1);
    expect(world.isAtBcEdge).toBe(true);
  });

  it('never lets the drone leave the box, even with a large step', () => {
    const world = buildMovedWorld(-114.05, 53, -113.5, 53);
    clampToBritishColumbia(world);
    expect(world.lng).toBeLessThanOrEqual(-114.03);
  });

  it('lets the drone move back inward at full speed from the edge', () => {
    const world = buildMovedWorld(-139.06, 55, -139.05, 55);
    clampToBritishColumbia(world);
    expect(world.lng).toBeCloseTo(-139.05, 12);
    expect(world.isAtBcEdge).toBe(true);
  });
});
