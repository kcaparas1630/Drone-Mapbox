// Decodes Mapbox terrain-RGB pixels into heights; anything outside −500…9000 m becomes NaN (security §4).
import { ROUTE_TUNING } from '@/shared/config';

const { MIN_VALID_ELEVATION_M, MAX_VALID_ELEVATION_M } = ROUTE_TUNING;

// Returns one height in metres per pixel of an RGBA buffer: −10000 + (R·65536 + G·256 + B) × 0.1.
export function decodeTerrainRgb(rgba: ArrayLike<number>, pixelCount: number): Float32Array {
  const heightsM = new Float32Array(pixelCount);
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    const encoded =
      (rgba[offset] ?? 0) * 65_536 + (rgba[offset + 1] ?? 0) * 256 + (rgba[offset + 2] ?? 0);
    const heightM = -10_000 + encoded * 0.1;
    heightsM[pixel] =
      heightM >= MIN_VALID_ELEVATION_M && heightM <= MAX_VALID_ELEVATION_M ? heightM : Number.NaN;
  }
  return heightsM;
}
