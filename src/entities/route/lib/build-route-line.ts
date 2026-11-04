// GeoJSON line along the great circle for the route layer, sampled with @turf/along at plan time (ADR 007).
import turfAlong from '@turf/along';
import type { Feature, LineString } from 'geojson';

const SAMPLE_SPACING_M = 5000;
const MAX_SAMPLES = 128;

// Returns a LineString feature from origin to destination that follows the curved great-circle path.
export function buildRouteLine(
  originLng: number,
  originLat: number,
  destinationLng: number,
  destinationLat: number,
  distanceM: number,
): Feature<LineString> {
  const chord: LineString = {
    type: 'LineString',
    coordinates: [
      [originLng, originLat],
      [destinationLng, destinationLat],
    ],
  };
  const segmentCount = Math.min(MAX_SAMPLES, Math.max(1, Math.ceil(distanceM / SAMPLE_SPACING_M)));
  const coordinates: number[][] = [];
  for (let index = 0; index <= segmentCount; index += 1) {
    const alongM = (distanceM * index) / segmentCount;
    coordinates.push(turfAlong(chord, alongM, { units: 'meters' }).geometry.coordinates);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } };
}
