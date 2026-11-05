// Tests footprints: mapped perimeters win, circles match the reported area, Out fires have none.
import { describe, expect, it } from 'vitest';

import type { Fire, FirePerimeter, FireStatus } from '@/entities/fire';
import { computeHaversineDistance } from '@/shared/lib/geo';

import { buildFireFootprints } from './build-fire-footprints';

// Builds a fire with a status and size at a fixed point.
function buildFire(fireNumber: string, status: FireStatus, sizeHa: number | null): Fire {
  return {
    fireNumber,
    incidentName: fireNumber,
    status,
    rawStatus: status,
    isFireOfNote: false,
    sizeHa,
    ignitionDateMs: null,
    location: null,
    cause: null,
    incidentUrl: null,
    lng: -122,
    lat: 53,
  };
}

const PERIMETER: FirePerimeter = {
  fireNumber: 'MAPPED',
  sizeHa: 40,
  rings: [
    [
      [-122, 53],
      [-122.01, 53],
      [-122.01, 53.01],
      [-122, 53],
    ],
  ],
};

describe('buildFireFootprints', () => {
  it('uses the mapped perimeter and marks it exact', () => {
    const [footprint] = buildFireFootprints(
      [buildFire('MAPPED', 'Being Held', 40)],
      [PERIMETER],
    ).features;
    expect(footprint?.geometry.coordinates).toEqual([PERIMETER.rings]);
    expect(footprint?.properties).toEqual({
      fireNumber: 'MAPPED',
      color: '#FFFF00',
      isApproximate: false,
    });
  });

  it('draws an approximate circle with the reported area: 654.8 ha is about 1.44 km across the radius', () => {
    const [footprint] = buildFireFootprints(
      [buildFire('CIRCLE', 'Under Control', 654.8)],
      [],
    ).features;
    const ring = footprint?.geometry.coordinates[0]?.[0] ?? [];
    const [lng, lat] = ring[0] ?? [0, 0];
    expect(ring).toHaveLength(49);
    expect(computeHaversineDistance(-122, 53, lng ?? 0, lat ?? 0)).toBeCloseTo(1443.7, 0);
    expect(footprint?.properties.isApproximate).toBe(true);
  });

  it('gives unknown sizes a 60 m circle and skips fires that are out', () => {
    const features = buildFireFootprints(
      [buildFire('SMALL', 'New', null), buildFire('OUT', 'Out', 500)],
      [],
    ).features;
    expect(features.map((feature) => feature.properties.fireNumber)).toEqual(['SMALL']);
    const [lng, lat] = features[0]?.geometry.coordinates[0]?.[0]?.[0] ?? [0, 0];
    expect(computeHaversineDistance(-122, 53, lng ?? 0, lat ?? 0)).toBeCloseTo(60, 0);
  });
});
