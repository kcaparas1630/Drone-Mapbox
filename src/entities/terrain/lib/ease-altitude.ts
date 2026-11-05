// Eases an altitude toward a target with a proportional rate capped at a maximum vertical speed.

// Returns the new altitude after dtS, moving faster when far away and never overshooting the target.
export function easeAltitude(
  currentMsl: number,
  targetMsl: number,
  maxRateMps: number,
  gainPerS: number,
  dtS: number,
): number {
  const differenceM = targetMsl - currentMsl;
  const rateMps = Math.min(maxRateMps, Math.max(-maxRateMps, differenceM * gainPerS));
  const stepM = rateMps * dtS;
  return Math.abs(stepM) >= Math.abs(differenceM) ? targetMsl : currentMsl + stepM;
}
