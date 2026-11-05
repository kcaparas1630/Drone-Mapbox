// Halo opacity for the beacon pulse; Fires of Note pulse faster so they stand out (ADR 015).

const BASE_OPACITY = 0.35;
const PULSE_AMPLITUDE = 0.25;
const NORMAL_PULSE_HZ = 0.6;
const NOTABLE_PULSE_HZ = 1.6;

// Returns the halo opacity at timeS; a disabled pulse holds the base opacity.
export function computeBeaconPulse(
  timeS: number,
  isNotable: boolean,
  isPulseEnabled: boolean,
): number {
  if (!isPulseEnabled) {
    return BASE_OPACITY;
  }
  const frequencyHz = isNotable ? NOTABLE_PULSE_HZ : NORMAL_PULSE_HZ;
  return BASE_OPACITY + PULSE_AMPLITUDE * Math.sin(2 * Math.PI * frequencyHz * timeS);
}
