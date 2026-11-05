// Tests radian-to-degree conversion.
import { describe, expect, it } from 'vitest';

import { toDegrees } from './to-degrees';

describe('toDegrees', () => {
  it('converts a half turn and a negative angle', () => {
    expect(toDegrees(Math.PI)).toBeCloseTo(180, 12);
    expect(toDegrees(-Math.PI / 2)).toBeCloseTo(-90, 12);
  });
});
