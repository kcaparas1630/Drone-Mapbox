// Converts validated perimeter features to outer rings inside BC (+1°); bad rings and points are dropped (ADR 023).
import { BC_BOUNDING_BOX, FIRE_FEED } from '@/shared/config';

import type { FirePerimeterFeature } from '../model/fire-perimeter.schema';
import type { FirePerimeter } from '../model/fire.types';

const MIN_RING_POINTS = 4;
const MARGIN_DEG = 1;

// Returns true when a position is a finite lng/lat inside the BC box widened by one degree.
function isUsablePosition(position: readonly number[]): boolean {
  const [lng, lat] = position;
  return (
    lng !== undefined &&
    lat !== undefined &&
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    lng >= BC_BOUNDING_BOX.WEST_LNG - MARGIN_DEG &&
    lng <= BC_BOUNDING_BOX.EAST_LNG + MARGIN_DEG &&
    lat >= BC_BOUNDING_BOX.SOUTH_LAT - MARGIN_DEG &&
    lat <= BC_BOUNDING_BOX.NORTH_LAT + MARGIN_DEG
  );
}

// Returns the ring as [lng, lat] pairs, or null when it is too short, too long or leaves BC.
function toRing(ring: readonly (readonly number[])[]): [number, number][] | null {
  if (ring.length < MIN_RING_POINTS || ring.length > FIRE_FEED.PERIMETER_MAX_RING_POINTS) {
    return null;
  }
  return ring.every(isUsablePosition)
    ? ring.map((position): [number, number] => [position[0] ?? 0, position[1] ?? 0])
    : null;
}

// Returns one perimeter per fire number with the outer ring of each polygon; the last feature wins.
export function normalizeFirePerimeters(
  features: readonly FirePerimeterFeature[],
): FirePerimeter[] {
  const byFireNumber = new Map<string, FirePerimeter>();
  for (const { geometry, properties } of features) {
    if (geometry === null) {
      continue;
    }
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    const rings = polygons
      .map((polygon) => (polygon[0] === undefined ? null : toRing(polygon[0])))
      .filter((ring): ring is [number, number][] => ring !== null);
    if (rings.length === 0) {
      continue;
    }
    const size = properties.FIRE_SIZE_HECTARES;
    const fireNumber = properties.FIRE_NUMBER.trim();
    byFireNumber.set(fireNumber, {
      fireNumber,
      sizeHa: typeof size === 'number' && Number.isFinite(size) && size >= 0 ? size : null,
      rings,
    });
  }
  return [...byFireNumber.values()];
}
