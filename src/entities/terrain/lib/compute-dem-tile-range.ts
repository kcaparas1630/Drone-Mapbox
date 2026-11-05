// Chooses the DEM tiles for a corridor: the finest zoom ≤ 10 whose tile range holds ≤ 12 tiles (ADR 022).
import { ROUTE_TUNING } from '@/shared/config';
import type { GeoBoundingBox } from '@/shared/lib/geo';

import type { DemTileRange } from '../model/dem-tile.types';

const { DEM_MAX_TILES, DEM_MIN_ZOOM, DEM_MAX_ZOOM } = ROUTE_TUNING;
const ZOOMS_FINEST_FIRST = [...Array(DEM_MAX_ZOOM - DEM_MIN_ZOOM + 1).keys()].map(
  (index) => DEM_MAX_ZOOM - index,
);

// Returns the web-mercator tile column for a longitude at a zoom.
function computeTileX(lng: number, zoom: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom);
}

// Returns the web-mercator tile row for a latitude at a zoom.
function computeTileY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  const mercatorY = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2;
  return Math.floor(mercatorY * 2 ** zoom);
}

// Returns the tile range covering the box, or the coarsest zoom's range if none fits the tile budget.
export function computeDemTileRange(box: GeoBoundingBox): DemTileRange {
  let range: DemTileRange | null = null;
  for (const zoom of ZOOMS_FINEST_FIRST) {
    range = {
      zoom,
      xMin: computeTileX(box.WEST_LNG, zoom),
      xMax: computeTileX(box.EAST_LNG, zoom),
      yMin: computeTileY(box.NORTH_LAT, zoom),
      yMax: computeTileY(box.SOUTH_LAT, zoom),
    };
    if ((range.xMax - range.xMin + 1) * (range.yMax - range.yMin + 1) <= DEM_MAX_TILES) {
      return range;
    }
  }
  return range ?? { zoom: DEM_MIN_ZOOM, xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
}
