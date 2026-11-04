// Tests degree-to-radian conversion.
import { describe, expect, it } from 'vitest';

import { toRadians } from './to-radians';

describe('toRadians', () => {
  it('converts a half turn and a negative angle', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 12);
    expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2, 12);
  });
});
