// Checks whether a lng/lat point lies inside a bounding box such as British Columbia's.
import type { GeoBoundingBox } from './geo.types';

// Returns true for finite coordinates within the box, edges included.
export function isInsideBoundingBox(lng: number, lat: number, box: GeoBoundingBox): boolean {
  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    lng >= box.WEST_LNG &&
    lng <= box.EAST_LNG &&
    lat >= box.SOUTH_LAT &&
    lat <= box.NORTH_LAT
  );
}
