// Picks the candidate curve with the lowest terrain (plus a detour penalty) and plans its profile (ADR 022, §6.2).
import { ROUTE_TUNING } from '@/shared/config';

import type { ElevationSampler, PathPoints, RoutePath } from '../model/route-path.types';
import { buildAltitudeProfile } from './build-altitude-profile';
import { computePathDistances } from './compute-path-distances';

const { MIN_KNOWN_TERRAIN_FRACTION, DETOUR_PENALTY_M_PER_M, MEAN_TERRAIN_WEIGHT } = ROUTE_TUNING;

type ScoredCandidate = {
  path: PathPoints;
  distancesM: number[];
  terrainM: (number | null)[];
  score: number;
};

// Scores one curve by its highest and mean known terrain plus its extra length; null when too little is known.
function computeCandidateScore(
  path: PathPoints,
  sampleElevation: ElevationSampler,
  straightM: number,
): ScoredCandidate | null {
  const distancesM = computePathDistances(path);
  const terrainM = path.lngs.map((lng, index) => sampleElevation(lng, path.lats[index] ?? 0));
  const known = terrainM.filter((sample): sample is number => sample !== null);
  if (known.length < MIN_KNOWN_TERRAIN_FRACTION * terrainM.length) {
    return null;
  }
  const meanM = known.reduce((sum, sample) => sum + sample, 0) / known.length;
  const detourM = (distancesM.at(-1) ?? 0) - straightM;
  const score = Math.max(...known) + MEAN_TERRAIN_WEIGHT * meanM + DETOUR_PENALTY_M_PER_M * detourM;
  return { path, distancesM, terrainM, score };
}

// Returns the best curve with its altitude profile; the straight line wins ties and data gaps.
export function planTerrainAwarePath(
  candidates: readonly PathPoints[],
  sampleElevation: ElevationSampler,
  startMsl: number,
): RoutePath | null {
  const [straight] = candidates;
  if (straight === undefined) {
    return null;
  }
  const straightM = computePathDistances(straight).at(-1) ?? 0;
  let best: ScoredCandidate | null = null;
  for (const candidate of candidates) {
    const scored = computeCandidateScore(candidate, sampleElevation, straightM);
    if (scored !== null && (best === null || scored.score < best.score)) {
      best = scored;
    }
  }
  const chosen = best ?? {
    path: straight,
    distancesM: computePathDistances(straight),
    terrainM: straight.lngs.map((lng, index) => sampleElevation(lng, straight.lats[index] ?? 0)),
  };
  return {
    lngs: [...chosen.path.lngs],
    lats: [...chosen.path.lats],
    altitudesMsl: buildAltitudeProfile(chosen.distancesM, chosen.terrainM, startMsl),
  };
}
