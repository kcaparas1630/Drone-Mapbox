// Compass blips for fires within 150 km: bearing, status colour and a size that grows as they get closer (§4.1).
import { FIRE_STATUS_PALETTE, type RankedFire } from '@/entities/fire';
import { toDegrees } from '@/shared/lib/geo';

const BLIP_RANGE_M = 150_000;
const MAX_BLIPS = 40;
const MIN_RADIUS = 2.5;
const MAX_RADIUS = 5;

export type FireBlip = { fireNumber: string; bearingDeg: number; color: string; radius: number };

// Returns blips for the ranked fires inside the range, nearest first, capped at 40.
export function computeFireBlips(rankedFires: readonly RankedFire[]): FireBlip[] {
  const blips: FireBlip[] = [];
  for (const { fire, distanceM, bearingRad } of rankedFires) {
    if (distanceM === null || bearingRad === null || distanceM > BLIP_RANGE_M) {
      continue;
    }
    const closeness = 1 - distanceM / BLIP_RANGE_M;
    blips.push({
      fireNumber: fire.fireNumber,
      bearingDeg: toDegrees(bearingRad),
      color: FIRE_STATUS_PALETTE[fire.status],
      radius: MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * closeness,
    });
    if (blips.length === MAX_BLIPS) {
      break;
    }
  }
  return blips;
}
