// Plans a route's terrain-aware path from fetched DEM tiles; null keeps the great circle (ADR 022, §6.2).
import {
  buildCandidatePaths,
  computePathsBoundingBox,
  planTerrainAwarePath,
} from '@/entities/route';
import type { RoutePath, RoutePlan } from '@/entities/route';
import { computeDemTileRange, createElevationSampler, loadDemTiles } from '@/entities/terrain';

// Returns the best curve with its altitude profile, or null when the DEM tiles could not be loaded.
export async function planRoutePath(
  accessToken: string,
  plan: RoutePlan,
  startAltitudeMsl: number,
  signal: AbortSignal,
): Promise<RoutePath | null> {
  const candidates = buildCandidatePaths({
    originLng: plan.originLng,
    originLat: plan.originLat,
    destinationLng: plan.destination.lng,
    destinationLat: plan.destination.lat,
  });
  const range = computeDemTileRange(computePathsBoundingBox(candidates));
  const tiles = await loadDemTiles(accessToken, range, signal);
  if (tiles === null || signal.aborted) {
    return null;
  }
  return planTerrainAwarePath(candidates, createElevationSampler(tiles), startAltitudeMsl);
}
