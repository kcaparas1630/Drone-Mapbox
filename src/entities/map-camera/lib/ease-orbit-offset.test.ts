// Tests that the orbit eases back after release, holds while dragging and snaps under reduced motion.
import { describe, expect, it } from 'vitest';

import { easeOrbitOffset } from './ease-orbit-offset';

const DT_S = 1 / 60;

describe('easeOrbitOffset', () => {
  it('returns to within 1% of centre about 1.5 s after release', () => {
    const orbit = { yawRad: 1, pitchRad: -0.5, isDragging: false, arrivalAngleRad: 0 };
    for (let step = 0; step < 90; step += 1) {
      easeOrbitOffset(orbit, DT_S, false);
    }
    expect(Math.abs(orbit.yawRad)).toBeLessThan(0.01);
    expect(Math.abs(orbit.pitchRad)).toBeLessThan(0.01);
  });

  it('keeps the offset while the user is dragging', () => {
    const orbit = { yawRad: 1, pitchRad: 0.2, isDragging: true, arrivalAngleRad: 0 };
    easeOrbitOffset(orbit, 1, false);
    expect(orbit).toMatchObject({ yawRad: 1, pitchRad: 0.2 });
  });

  it('snaps straight back when reduced motion is preferred', () => {
    const orbit = { yawRad: 1, pitchRad: 0.2, isDragging: false, arrivalAngleRad: 0 };
    easeOrbitOffset(orbit, DT_S, true);
    expect(orbit).toMatchObject({ yawRad: 0, pitchRad: 0 });
  });

  it('snaps tiny offsets to exactly zero', () => {
    const orbit = { yawRad: 0.0005, pitchRad: -0.0005, isDragging: false, arrivalAngleRad: 0 };
    easeOrbitOffset(orbit, DT_S, false);
    expect(orbit).toMatchObject({ yawRad: 0, pitchRad: 0 });
  });
});
