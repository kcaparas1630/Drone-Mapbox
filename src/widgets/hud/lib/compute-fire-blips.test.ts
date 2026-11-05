// Tests which fires become compass blips and how big they are.
import { describe, expect, it } from 'vitest';

import type { Fire, RankedFire } from '@/entities/fire';

import { computeFireBlips } from './compute-fire-blips';

// Builds a ranked fire at a distance and bearing.
function buildRanked(fireNumber: string, distanceM: number | null, bearingRad: number): RankedFire {
  const fire: Fire = {
    fireNumber,
    incidentName: fireNumber,
    status: 'New',
    rawStatus: 'New',
    isFireOfNote: false,
    sizeHa: null,
    ignitionDateMs: null,
    location: null,
    cause: null,
    incidentUrl: null,
    lng: 0,
    lat: 0,
  };
  return { fire, distanceM, bearingRad: distanceM === null ? null : bearingRad };
}

describe('computeFireBlips', () => {
  it('keeps fires within 150 km with their bearing in degrees and status colour', () => {
    const blips = computeFireBlips([
      buildRanked('NEAR', 0, Math.PI / 2),
      buildRanked('EDGE', 150_000, Math.PI),
      buildRanked('FAR', 150_001, 0),
    ]);
    expect(blips.map((blip) => blip.fireNumber)).toEqual(['NEAR', 'EDGE']);
    expect(blips[0]).toMatchObject({ bearingDeg: 90, color: '#FC921F', radius: 5 });
    expect(blips[1]?.radius).toBeCloseTo(2.5, 5);
  });

  it('skips fires without a distance and caps the list at 40', () => {
    const many = [...Array(50).keys()].map((index) => buildRanked(`F${String(index)}`, 1000, 0));
    expect(computeFireBlips([buildRanked('NONE', null, 0), ...many])).toHaveLength(40);
  });
});
