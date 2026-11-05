// Tests the default chase-camera elevation angle.
import { describe, expect, it } from 'vitest';

import { getDefaultElevationRad } from './get-default-elevation-rad';

describe('getDefaultElevationRad', () => {
  it('is atan(25 / 60), about 22.6 degrees', () => {
    expect((getDefaultElevationRad() * 180) / Math.PI).toBeCloseTo(22.62, 2);
  });
});
