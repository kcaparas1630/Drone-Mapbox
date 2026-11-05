// Unit east/north components of a compass heading, written into an out object for per-frame use.

export type HeadingVector = { east: number; north: number };

// Writes sin(heading) as the east component and cos(heading) as the north component into out.
export function computeHeadingVector(out: HeadingVector, headingRad: number): void {
  out.east = Math.sin(headingRad);
  out.north = Math.cos(headingRad);
}
