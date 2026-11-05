// Tests free-flight stepping: turning, banking, climbing, the ceiling and geodesic movement.
import { describe, expect, it } from 'vitest';

import { createSimWorld } from '../model/sim-world';
import { stepFreeFlight } from './step-free-flight';

const DT_S = 1 / 60;

// Builds a world at Prince George heading north at 1000 m.
function buildWorld() {
  return createSimWorld({ lng: -122.75, lat: 53.92, altitudeMsl: 1000, headingRad: 0 });
}

// Steps the world for a number of seconds.
function runFor(world: ReturnType<typeof buildWorld>, seconds: number): void {
  for (let step = 0; step < Math.round(seconds / DT_S); step += 1) {
    stepFreeFlight(world, DT_S);
  }
}

describe('stepFreeFlight', () => {
  it('turns at 90°/s, wraps heading into [0, 2π) and banks into the turn', () => {
    const world = buildWorld();
    world.input.yaw = -1;
    runFor(world, 1);
    expect(world.headingRad).toBeCloseTo((3 * Math.PI) / 2, 6);
    expect(world.bankRad).toBeLessThan(-0.3);
  });

  it('moves north along the meridian at full thrust and records the previous position', () => {
    const world = buildWorld();
    world.input.forward = 1;
    runFor(world, 5);
    expect(world.lng).toBeCloseTo(-122.75, 9);
    expect(world.lat).toBeGreaterThan(53.92);
    expect(world.previousLat).toBeLessThan(world.lat);
  });

  it('climbs at up to 60 m/s', () => {
    const world = buildWorld();
    world.input.vertical = 1;
    runFor(world, 2);
    expect(world.verticalSpeedMps).toBe(60);
    expect(world.altitudeMsl).toBeGreaterThan(1100);
  });

  it('stops climbing at the 12 000 m ceiling and flags it', () => {
    const world = buildWorld();
    world.altitudeMsl = 11_990;
    world.input.vertical = 1;
    runFor(world, 1);
    expect(world.altitudeMsl).toBe(12_000);
    expect(world.isAtCeiling).toBe(true);
    expect(world.verticalSpeedMps).toBe(0);
  });
});
