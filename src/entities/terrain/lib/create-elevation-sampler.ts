// Turns decoded DEM tiles into an elevation lookup with bilinear interpolation inside each tile (ADR 022).
import type { DemTile } from '../model/dem-tile.types';

// Returns the tile's height at a pixel, or NaN outside it.
function readHeight(tile: DemTile, column: number, row: number): number {
  const clampedColumn = Math.min(tile.size - 1, Math.max(0, column));
  const clampedRow = Math.min(tile.size - 1, Math.max(0, row));
  return tile.heightsM[clampedRow * tile.size + clampedColumn] ?? Number.NaN;
}

// Returns a function giving the height in metres at lng/lat, or null outside the tiles or on bad pixels.
export function createElevationSampler(
  tiles: readonly DemTile[],
): (lng: number, lat: number) => number | null {
  const tileByKey = new Map(tiles.map((tile) => [`${String(tile.x)}/${String(tile.y)}`, tile]));
  const zoom = tiles[0]?.zoom ?? 0;
  return (lng, lat) => {
    const latRad = (lat * Math.PI) / 180;
    const worldX = ((lng + 180) / 360) * 2 ** zoom;
    const worldY =
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom;
    const tile = tileByKey.get(`${String(Math.floor(worldX))}/${String(Math.floor(worldY))}`);
    if (tile === undefined) {
      return null;
    }
    const pixelX = (worldX - tile.x) * tile.size - 0.5;
    const pixelY = (worldY - tile.y) * tile.size - 0.5;
    const column = Math.floor(pixelX);
    const row = Math.floor(pixelY);
    const fractionX = pixelX - column;
    const fractionY = pixelY - row;
    const top =
      readHeight(tile, column, row) * (1 - fractionX) +
      readHeight(tile, column + 1, row) * fractionX;
    const bottom =
      readHeight(tile, column, row + 1) * (1 - fractionX) +
      readHeight(tile, column + 1, row + 1) * fractionX;
    const heightM = top * (1 - fractionY) + bottom * fractionY;
    return Number.isFinite(heightM) ? heightM : null;
  };
}
