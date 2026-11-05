// Beacon height from fire size (log scale, clamped), grown with distance so far fires stay visible (ADR 015).

export type BeaconSize = { heightM: number; widthM: number };

const MIN_HEIGHT_M = 150;
const MAX_HEIGHT_M = 900;
const HEIGHT_PER_DECADE_M = 120;
const NEAR_DISTANCE_M = 8000;
const MAX_DISTANCE_GROWTH = 25;
const WIDTH_RATIO = 0.06;
const MIN_WIDTH_M = 12;

// Writes the beacon's height and width in metres into out.
export function computeBeaconSize(out: BeaconSize, sizeHa: number | null, distanceM: number): void {
  const sizeHeightM = MIN_HEIGHT_M + HEIGHT_PER_DECADE_M * Math.log10(1 + Math.max(0, sizeHa ?? 0));
  const distanceGrowth = Math.min(MAX_DISTANCE_GROWTH, Math.max(1, distanceM / NEAR_DISTANCE_M));
  out.heightM = Math.min(MAX_HEIGHT_M, sizeHeightM) * distanceGrowth;
  out.widthM = Math.max(MIN_WIDTH_M, out.heightM * WIDTH_RATIO);
}
