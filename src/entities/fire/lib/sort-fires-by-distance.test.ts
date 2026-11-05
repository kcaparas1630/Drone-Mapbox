// Tests sorting fires nearest first with their bearing, and the by-name order before the first snapshot.
import { describe, expect, it } from 'vitest';

import type { Fire } from '../model/fire.types';
import { sortFiresByDistance } from './sort-fires-by-distance';

// Builds a minimal fire with a name at a point.
function buildFire(incidentName: string, lng: number, lat: number): Fire {
  return {
    fireNumber: incidentName.toUpperCase(),
    incidentName,
    status: 'Out of Control',
    rawStatus: 'Out of Control',
    isFireOfNote: false,
    sizeHa: 5,
    ignitionDateMs: null,
    location: null,
    cause: null,
    incidentUrl: null,
    lng,
    lat,
  };
}

const FIRES = [
  buildFire('West fire', -123.5, 53.9),
  buildFire('North fire', -122.75, 54.0),
  buildFire('East fire', -121.0, 53.9),
];

describe('sortFiresByDistance', () => {
  it('puts the nearest fire first and gives the bearing from the origin to each fire', () => {
    const ranked = sortFiresByDistance(FIRES, { lng: -122.75, lat: 53.9 });
    expect(ranked.map((entry) => entry.fire.incidentName)).toEqual([
      'North fire',
      'West fire',
      'East fire',
    ]);
    expect((ranked[0]?.distanceM ?? 0) / 1000).toBeCloseTo(11.1, 1);
    expect(ranked[0]?.bearingRad ?? -1).toBeCloseTo(0, 3);
    expect(((ranked[1]?.bearingRad ?? 0) * 180) / Math.PI).toBeCloseTo(270, 0);
  });

  it('sorts by name with no distance or bearing when the drone position is unknown', () => {
    const ranked = sortFiresByDistance(FIRES, null);
    expect(ranked.map((entry) => entry.fire.incidentName)).toEqual([
      'East fire',
      'North fire',
      'West fire',
    ]);
    expect(ranked.every((entry) => entry.distanceM === null && entry.bearingRad === null)).toBe(
      true,
    );
  });
});
