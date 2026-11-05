// Tests the flicker range, its width compensation and the reduced-motion freeze.
import { describe, expect, it } from 'vitest';

import { computeFlameFlicker, type FlameFlicker } from './compute-flame-flicker';

describe('computeFlameFlicker', () => {
  it('stays within ±12 % in height and narrows as it stretches', () => {
    const out: FlameFlicker = { heightScale: 0, widthScale: 0 };
    for (let step = 0; step < 200; step += 1) {
      computeFlameFlicker(out, step / 60, 1.3, true);
      expect(Math.abs(out.heightScale - 1)).toBeLessThanOrEqual(0.12 + 1e-9);
      expect(out.widthScale - 1).toBeCloseTo(-(out.heightScale - 1) / 2, 9);
    }
  });

  it('holds the flame still when motion is reduced', () => {
    const out: FlameFlicker = { heightScale: 0, widthScale: 0 };
    computeFlameFlicker(out, 4.2, 0.5, false);
    expect(out).toEqual({ heightScale: 1, widthScale: 1 });
  });
});
