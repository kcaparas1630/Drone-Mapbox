// Tests that a new orbit has no offset.
import { describe, expect, it } from 'vitest';

import { createOrbitState } from './orbit-state';

describe('createOrbitState', () => {
  it('starts centred behind the drone and not dragging', () => {
    expect(createOrbitState()).toEqual({
      yawRad: 0,
      pitchRad: 0,
      isDragging: false,
      arrivalAngleRad: 0,
    });
  });
});
