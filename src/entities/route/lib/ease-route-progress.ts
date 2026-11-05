// Ease-in/ease-out curve for route progress, so the drone accelerates away and slows into arrival (§6.1).

// Returns the eased fraction (0..1) of the distance covered at time fraction t (clamped to 0..1).
export function easeRouteProgress(timeFraction: number): number {
  const t = Math.min(1, Math.max(0, timeFraction));
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
