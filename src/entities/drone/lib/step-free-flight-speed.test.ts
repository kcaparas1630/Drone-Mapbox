// Tests thrust, braking, reverse, boost and drag of the free-flight speed model.
import { describe, expect, it } from 'vitest';

import { stepFreeFlightSpeed } from './step-free-flight-speed';

const DT_S = 1 / 60;

// Runs the speed model for a number of seconds with constant input.
function runFor(seconds: number, startMps: number, forward: number, isBoosting = false): number {
  let speedMps = startMps;
  for (let step = 0; step < Math.round(seconds / DT_S); step += 1) {
    speedMps = stepFreeFlightSpeed(speedMps, forward, isBoosting, DT_S);
  }
  return speedMps;
}

describe('stepFreeFlightSpeed', () => {
  it('accelerates at 60 m/s² and caps at 150 m/s', () => {
    expect(runFor(1, 0, 1)).toBeCloseTo(60, 6);
    expect(runFor(5, 0, 1)).toBe(150);
  });

  it('reaches the 600 m/s boost cap and drags back to 150 m/s when boost is released', () => {
    const boosted = runFor(5, 0, 1, true);
    expect(boosted).toBe(600);
    expect(runFor(5, boosted, 1)).toBeCloseTo(150, 6);
  });

  it('drags to a stop in about two seconds without input', () => {
    expect(runFor(2.6, 150, 0)).toBe(0);
    expect(runFor(1, 150, 0)).toBeGreaterThan(0);
  });

  it('brakes before reversing, then reverses at half thrust', () => {
    expect(runFor(0.5, 100, -1)).toBeCloseTo(40, 6);
    expect(runFor(10, 100, -1)).toBe(-75);
  });

  it('brakes a reversing drone when thrusting forward', () => {
    expect(runFor(0.25, -60, 1)).toBeCloseTo(-30, 6);
  });
});
