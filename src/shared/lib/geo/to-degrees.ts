// Converts radians to degrees at module edges, where the simulation meets lng/lat and the HUD.

// Returns the angle in degrees.
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
