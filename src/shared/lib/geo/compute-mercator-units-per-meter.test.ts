// Tests the metre-to-mercator scale at the equator and at 60° N.
import { describe, expect, it } from 'vitest';

import { computeMercatorUnitsPerMeter } from './compute-mercator-units-per-meter';

describe('computeMercatorUnitsPerMeter', () => {
  it('is one over the Earth circumference at the equator', () => {
    expect(computeMercatorUnitsPerMeter(0)).toBeCloseTo(1 / (2 * Math.PI * 6_371_008.8), 20);
  });

  it('doubles at 60° N because meridians converge', () => {
    expect(computeMercatorUnitsPerMeter(60) / computeMercatorUnitsPerMeter(0)).toBeCloseTo(2, 9);
  });
});
