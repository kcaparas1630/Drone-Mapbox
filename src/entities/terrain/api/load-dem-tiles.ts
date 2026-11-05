// Loads the terrain-DEM tiles covering a route corridor, decoded and cached in memory per tile (ADR 022).
import { fetchImageBitmap } from '@/shared/api';
import { ROUTE_TUNING } from '@/shared/config';

import { decodeTerrainRgb } from '../lib/decode-terrain-rgb';
import type { DemTile, DemTileRange } from '../model/dem-tile.types';

const DEM_TILESET_URL = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-dem-v1';
const VALID_TILE_SIZES = new Set([256, 512]);

const tileByKey = new Map<string, DemTile>();

// Draws the bitmap on an offscreen canvas and decodes its pixels; null unless it is a 256 or 512 px square.
function decodeDemBitmap(bitmap: ImageBitmap): Float32Array | null {
  const size = bitmap.width;
  if (bitmap.height !== size || !VALID_TILE_SIZES.has(size)) {
    bitmap.close();
    return null;
  }
  const context = new OffscreenCanvas(size, size).getContext('2d', { willReadFrequently: true });
  if (context === null) {
    bitmap.close();
    return null;
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return decodeTerrainRgb(context.getImageData(0, 0, size, size).data, size * size);
}

// Returns one tile from the cache or the network, or null when it cannot be loaded or decoded.
async function loadDemTile(
  accessToken: string,
  zoom: number,
  x: number,
  y: number,
  signal: AbortSignal,
): Promise<DemTile | null> {
  const key = `${String(zoom)}/${String(x)}/${String(y)}`;
  const cached = tileByKey.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const url = new URL(`${DEM_TILESET_URL}/${key}.pngraw`);
  url.searchParams.set('access_token', accessToken);
  const result = await fetchImageBitmap(url.toString(), {
    signal,
    timeoutMs: ROUTE_TUNING.DEM_TIMEOUT_MS,
    maxBytes: ROUTE_TUNING.DEM_MAX_BYTES,
  });
  const heightsM = result.isOk ? decodeDemBitmap(result.value) : null;
  if (heightsM === null) {
    return null;
  }
  const tile = { zoom, x, y, size: Math.sqrt(heightsM.length), heightsM };
  tileByKey.set(key, tile);
  return tile;
}

// Returns every tile in the range, or null if any tile failed, so planning falls back to the great circle.
export async function loadDemTiles(
  accessToken: string,
  range: DemTileRange,
  signal: AbortSignal,
): Promise<DemTile[] | null> {
  const requests: Promise<DemTile | null>[] = [];
  for (let x = range.xMin; x <= range.xMax; x += 1) {
    for (let y = range.yMin; y <= range.yMax; y += 1) {
      requests.push(loadDemTile(accessToken, range.zoom, x, y, signal));
    }
  }
  const tiles = await Promise.all(requests);
  return tiles.every((tile): tile is DemTile => tile !== null) ? tiles : null;
}
