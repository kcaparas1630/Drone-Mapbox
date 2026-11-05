// Tests where the default chase camera draws the drone below the centre of view.
import { describe, expect, it } from 'vitest';

import { getDroneDropRatio } from './get-drone-drop-ratio';

describe('getDroneDropRatio', () => {
  it('puts the drone about 22.6 % of the view height below the centre', () => {
    const depressionToDroneRad = Math.atan2(25, 60);
    const depressionToAimRad = Math.atan2(25, 100);
    const expected = (0.5 * Math.tan(depressionToDroneRad - depressionToAimRad)) / (1 / 3);
    expect(getDroneDropRatio()).toBeCloseTo(expected, 9);
    expect(getDroneDropRatio()).toBeCloseTo(0.2263, 3);
  });
});
