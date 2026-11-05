// Converts degrees to radians at module edges, where lng/lat and UI values meet the simulation.

// Returns the angle in radians.
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
