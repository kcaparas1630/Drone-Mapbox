// Tests that the simulation world starts at the spawn with neutral motion and preallocated buffers.
import { describe, expect, it } from 'vitest';

import { createSimWorld } from './sim-world';

describe('createSimWorld', () => {
  it('starts at a saved spawn with its altitude and heading', () => {
    const world = createSimWorld({ lng: -120, lat: 50, altitudeMsl: 900, headingRad: 1 });
    expect(world).toMatchObject({
      lng: -120,
      lat: 50,
      previousLng: -120,
      previousLat: 50,
      altitudeMsl: 900,
      isAltitudePending: false,
      headingRad: 1,
      speedMps: 0,
    });
  });

  it('marks the altitude pending when the spawn has none', () => {
    const world = createSimWorld({ lng: -120, lat: 50, altitudeMsl: null, headingRad: 0 });
    expect(world.isAltitudePending).toBe(true);
    expect(world.altitudeMsl).toBe(2000);
  });

  it('preallocates one terrain slot per lookahead distance', () => {
    const world = createSimWorld({ lng: -120, lat: 50, altitudeMsl: null, headingRad: 0 });
    expect(world.terrainSamplesM).toEqual([null, null, null, null]);
    expect(world.route.routeId).toBe(0);
  });

  it('preallocates the route path buffers so starting a route never allocates per frame', () => {
    const world = createSimWorld({ lng: -120, lat: 50, altitudeMsl: null, headingRad: 0 });
    expect(world.route.pathLngs).toHaveLength(256);
    expect(world.route.pathDistancesM).toHaveLength(256);
    expect(world.route).toMatchObject({ pathCount: 0, segmentIndex: 0, adoptedPath: null });
  });
});
