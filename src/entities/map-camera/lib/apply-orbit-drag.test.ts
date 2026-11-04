// Tests orbit dragging and its yaw and pitch limits.
import { describe, expect, it } from 'vitest';

import { createOrbitState } from '../model/orbit-state';
import { applyOrbitDrag } from './apply-orbit-drag';

const DEG = Math.PI / 180;

describe('applyOrbitDrag', () => {
  it('turns the camera opposite to a horizontal drag and tilts it with a vertical drag', () => {
    const orbit = createOrbitState();
    applyOrbitDrag(orbit, 100, 20);
    expect(orbit.yawRad).toBeCloseTo(-0.5, 9);
    expect(orbit.pitchRad).toBeCloseTo(0.1, 9);
  });

  it('limits yaw to ±90°', () => {
    const orbit = createOrbitState();
    applyOrbitDrag(orbit, -10_000, 0);
    expect(orbit.yawRad).toBeCloseTo(90 * DEG, 9);
  });

  it('limits the camera elevation to 15–60° (Mapbox pitch 75–30°)', () => {
    const defaultElevationRad = Math.atan2(25, 60);
    const orbit = createOrbitState();
    applyOrbitDrag(orbit, 0, 10_000);
    expect(defaultElevationRad + orbit.pitchRad).toBeCloseTo(60 * DEG, 9);
    applyOrbitDrag(orbit, 0, -100_000);
    expect(defaultElevationRad + orbit.pitchRad).toBeCloseTo(15 * DEG, 9);
  });
});
