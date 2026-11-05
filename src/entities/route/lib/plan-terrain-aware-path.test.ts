// Tests choosing a curve around a mountain, staying straight on flat ground, and coping with missing terrain.
import { describe, expect, it } from 'vitest';

import { planTerrainAwarePath } from './plan-terrain-aware-path';

const POINT_COUNT = 31;

// Builds a northbound path from 53.9° to 54.2° N bowed east (positive) or west by up to bowDeg of longitude.
function buildBowedPath(bowDeg: number) {
  const steps = [...Array(POINT_COUNT).keys()].map((index) => index / (POINT_COUNT - 1));
  return {
    lngs: steps.map((t) => -122.75 + bowDeg * 4 * t * (1 - t)),
    lats: steps.map((t) => 53.9 + 0.3 * t),
  };
}

const CANDIDATES = [buildBowedPath(0), buildBowedPath(0.2), buildBowedPath(-0.2)];

// Returns 600 m ground with a 2,500 m mountain within ~5 km of the straight line's midpoint.
function sampleMountainTerrain(lng: number, lat: number): number {
  const isNearMountain = Math.abs(lng + 122.75) < 0.08 && Math.abs(lat - 54.05) < 0.05;
  return isNearMountain ? 2500 : 600;
}

describe('planTerrainAwarePath', () => {
  it('curves around a mountain on the straight line and keeps 300 m over the ground', () => {
    const path = planTerrainAwarePath(CANDIDATES, sampleMountainTerrain, 1100);
    const middle = Math.floor((path?.lngs.length ?? 0) / 2);
    expect(Math.abs((path?.lngs[middle] ?? 0) + 122.75)).toBeGreaterThan(0.08);
    expect(path?.altitudesMsl[0]).toBe(1100);
    expect(Math.min(...(path?.altitudesMsl.slice(1) ?? []))).toBeGreaterThanOrEqual(899);
  });

  it('flies straight over flat ground', () => {
    const path = planTerrainAwarePath(CANDIDATES, () => 600, 1100);
    expect(path?.lngs).toEqual(CANDIDATES[0]?.lngs);
  });

  it('falls back to the straight line with the envelope when no terrain is known', () => {
    const path = planTerrainAwarePath(CANDIDATES, () => null, 1100);
    expect(path?.lngs).toEqual(CANDIDATES[0]?.lngs);
    expect(path?.altitudesMsl.at(-1)).toBeCloseTo(1100, 0);
  });

  it('returns null without candidates', () => {
    expect(planTerrainAwarePath([], () => 0, 1000)).toBeNull();
  });
});
