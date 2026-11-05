// Converts a drag offset into a stick vector clamped to the unit circle (behaviour §3.2).

export type StickVector = { x: number; y: number };

const DEAD_ZONE = 0.08;

// Returns x right-positive and y up-positive in -1..1, zero inside a small dead zone.
export function computeStickVector(
  deltaXPx: number,
  deltaYPx: number,
  radiusPx: number,
): StickVector {
  if (radiusPx <= 0) {
    return { x: 0, y: 0 };
  }
  const x = deltaXPx / radiusPx;
  const y = -deltaYPx / radiusPx;
  const length = Math.hypot(x, y);
  if (length < DEAD_ZONE) {
    return { x: 0, y: 0 };
  }
  const scale = length > 1 ? 1 / length : 1;
  return { x: x * scale, y: y * scale };
}
