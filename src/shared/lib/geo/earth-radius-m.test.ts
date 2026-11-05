// Tests that the Earth radius matches turf's datum so plan-time and per-frame maths agree.
import { describe, expect, it } from 'vitest';

import { EARTH_RADIUS_M } from './earth-radius-m';

describe('EARTH_RADIUS_M', () => {
  it('is the IUGG mean radius turf uses, in metres', () => {
    expect(EARTH_RADIUS_M).toBe(6_371_008.8);
  });
});
