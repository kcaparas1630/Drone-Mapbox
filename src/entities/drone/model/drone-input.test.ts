// Tests that a fresh drone input is neutral and independent.
import { describe, expect, it } from 'vitest';

import { createDroneInput } from './drone-input';

describe('createDroneInput', () => {
  it('returns a neutral, independent input each time', () => {
    const first = createDroneInput();
    expect(first).toEqual({ forward: 0, yaw: 0, vertical: 0, isBoosting: false });
    expect(createDroneInput()).not.toBe(first);
  });
});
