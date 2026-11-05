// Flame flicker: two out-of-phase waves stretch the flame up while it narrows; still when motion is reduced.

export type FlameFlicker = { heightScale: number; widthScale: number };

const SLOW_HZ = 1.7;
const FAST_HZ = 3.1;
const SLOW_AMPLITUDE = 0.08;
const FAST_AMPLITUDE = 0.04;

// Writes the height and width scale at timeS for a flame with its own phase into out.
export function computeFlameFlicker(
  out: FlameFlicker,
  timeS: number,
  phaseRad: number,
  isEnabled: boolean,
): void {
  if (!isEnabled) {
    out.heightScale = 1;
    out.widthScale = 1;
    return;
  }
  const stretch =
    SLOW_AMPLITUDE * Math.sin(2 * Math.PI * SLOW_HZ * timeS + phaseRad) +
    FAST_AMPLITUDE * Math.sin(2 * Math.PI * FAST_HZ * timeS + 2 * phaseRad);
  out.heightScale = 1 + stretch;
  out.widthScale = 1 - stretch / 2;
}
