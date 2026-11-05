// The lng/lat box around every candidate curve: the corridor whose DEM tiles a route plan needs (ADR 022).
import type { GeoBoundingBox } from '@/shared/lib/geo';

import type { PathPoints } from '../model/route-path.types';

// Returns the smallest box containing every point of every path.
export function computePathsBoundingBox(paths: readonly PathPoints[]): GeoBoundingBox {
  const lngs = paths.flatMap((path) => path.lngs);
  const lats = paths.flatMap((path) => path.lats);
  return {
    WEST_LNG: Math.min(...lngs),
    SOUTH_LAT: Math.min(...lats),
    EAST_LNG: Math.max(...lngs),
    NORTH_LAT: Math.max(...lats),
  };
}
