// Samples terrain at 0, 1, 3 and 6 km ahead along a heading into a preallocated array (ADR 007).
import type { Map as MapboxMap } from 'mapbox-gl';

import { FLIGHT_TUNING } from '@/shared/config';
import { computeDestinationPoint, type GeoPoint } from '@/shared/lib/geo';

import { sampleTerrainElevation } from './sample-terrain-elevation';

const scratchPoint: GeoPoint = { lng: 0, lat: 0 };

// Writes one elevation (or null) per lookahead distance into outSamples.
export function sampleTerrainAhead(
  map: MapboxMap,
  lng: number,
  lat: number,
  headingRad: number,
  outSamples: (number | null)[],
): void {
  const distances = FLIGHT_TUNING.LOOKAHEAD_DISTANCES_M;
  for (let index = 0; index < distances.length; index += 1) {
    computeDestinationPoint(scratchPoint, lng, lat, headingRad, distances[index] ?? 0);
    outSamples[index] = sampleTerrainElevation(map, scratchPoint.lng, scratchPoint.lat);
  }
}
