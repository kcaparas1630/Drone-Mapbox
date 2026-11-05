// Tests the candidate curves: straight first, bowed both ways, endpoints fixed, short routes straight only.
import { describe, expect, it } from 'vitest';

import { buildCandidatePaths } from './build-candidate-paths';

const LONG_ROUTE = {
  originLng: -122.75,
  originLat: 53.9,
  destinationLng: -122.75,
  destinationLat: 54.3,
};

describe('buildCandidatePaths', () => {
  it('returns seven curves that share both endpoints, the straight line first', () => {
    const candidates = buildCandidatePaths(LONG_ROUTE);
    expect(candidates).toHaveLength(7);
    for (const candidate of candidates) {
      expect(candidate.lngs[0]).toBeCloseTo(-122.75, 9);
      expect(candidate.lats[0]).toBeCloseTo(53.9, 9);
      expect(candidate.lngs.at(-1)).toBeCloseTo(-122.75, 9);
      expect(candidate.lats.at(-1)).toBeCloseTo(54.3, 9);
    }
    const middle = Math.floor((candidates[0]?.lngs.length ?? 0) / 2);
    expect(candidates[0]?.lngs[middle]).toBeCloseTo(-122.75, 6);
  });

  it('bows a northbound route east for a positive offset and west for a negative one', () => {
    const [, east, west] = buildCandidatePaths(LONG_ROUTE);
    const middle = Math.floor((east?.lngs.length ?? 0) / 2);
    expect(east?.lngs[middle] ?? 0).toBeGreaterThan(-122.75 + 0.05);
    expect(west?.lngs[middle] ?? 0).toBeLessThan(-122.75 - 0.05);
  });

  it('keeps routes under 3 km straight with at least 16 points', () => {
    const candidates = buildCandidatePaths({ ...LONG_ROUTE, destinationLat: 53.91 });
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.lngs).toHaveLength(16);
  });
});
