// Wraps angles into (-π, π] so heading differences take the shortest way round.

const FULL_TURN_RAD = 2 * Math.PI;

// Returns the equivalent angle in radians within (-π, π].
export function normalizeAngle(radians: number): number {
  const wrapped = (((radians + Math.PI) % FULL_TURN_RAD) + FULL_TURN_RAD) % FULL_TURN_RAD;
  return wrapped === 0 ? Math.PI : wrapped - Math.PI;
}
