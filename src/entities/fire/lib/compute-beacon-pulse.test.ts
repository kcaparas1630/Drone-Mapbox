// Tests the beacon pulse: bounded opacity, faster Fires of Note, steady when disabled.
import { describe, expect, it } from 'vitest';

import { computeBeaconPulse } from './compute-beacon-pulse';

describe('computeBeaconPulse', () => {
  it('stays between 0.1 and 0.6', () => {
    for (let step = 0; step < 100; step += 1) {
      const opacity = computeBeaconPulse(step * 0.037, step % 2 === 0, true);
      expect(opacity).toBeGreaterThanOrEqual(0.1 - 1e-9);
      expect(opacity).toBeLessThanOrEqual(0.6 + 1e-9);
    }
  });

  it('pulses Fires of Note at a different rate', () => {
    expect(computeBeaconPulse(0.2, true, true)).not.toBeCloseTo(
      computeBeaconPulse(0.2, false, true),
      3,
    );
  });

  it('holds the base opacity when the pulse is disabled (reduced motion or low fps)', () => {
    expect(computeBeaconPulse(0.4, true, false)).toBe(0.35);
  });
});
