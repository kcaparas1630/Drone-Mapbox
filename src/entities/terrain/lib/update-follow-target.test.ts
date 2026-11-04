// Tests the terrain-following target, including partial and total loss of terrain data (behaviour §6.3).
import { describe, expect, it } from 'vitest';

import { createTerrainFollowState } from '../model/terrain-follow-state';
import { updateFollowTarget } from './update-follow-target';

const DT_S = 1 / 60;
const ALL_NULL = [null, null, null, null];

describe('updateFollowTarget', () => {
  it('targets the highest sample plus 300 m clearance plus the speed margin', () => {
    const state = createTerrainFollowState();
    updateFollowTarget(state, [400, 2000, 900, 600], 1000, 0.5, DT_S);
    expect(state.targetMsl).toBe(2550);
  });

  it('lets the target descend when every sample is known', () => {
    const state = { targetMsl: 3000, allMissingS: 0 };
    updateFollowTarget(state, [400, 500, 450, 300], 3000, 0, DT_S);
    expect(state.targetMsl).toBe(800);
  });

  it('never lowers the target while some samples are missing', () => {
    const state = { targetMsl: 3000, allMissingS: 0 };
    updateFollowTarget(state, [400, null, 450, null], 3000, 0, DT_S);
    expect(state.targetMsl).toBe(3000);
  });

  it('holds at least the current altitude for the first two seconds of total loss', () => {
    const state = { targetMsl: 1500, allMissingS: 0 };
    for (let step = 0; step < 60; step += 1) {
      updateFollowTarget(state, ALL_NULL, 1800, 1, DT_S);
    }
    expect(state.targetMsl).toBe(1800);
  });

  it('keeps the target when every sample is null and the drone was already following', () => {
    const state = { targetMsl: 2400, allMissingS: 0 };
    updateFollowTarget(state, ALL_NULL, 2000, 0, DT_S);
    expect(state.targetMsl).toBe(2400);
  });

  it('raises the target 100 m/s after two seconds of total loss, up to the ceiling', () => {
    const state = createTerrainFollowState();
    for (let step = 0; step < 180; step += 1) {
      updateFollowTarget(state, ALL_NULL, 1000, 0, DT_S);
    }
    expect(state.targetMsl).toBeGreaterThan(1095);
    expect(state.targetMsl).toBeLessThan(1105);
    const nearCeiling = { targetMsl: 11_990, allMissingS: 10 };
    updateFollowTarget(nearCeiling, ALL_NULL, 11_990, 0, 1);
    expect(nearCeiling.targetMsl).toBe(12_000);
  });

  it('resets the missing timer as soon as a sample returns', () => {
    const state = { targetMsl: 1500, allMissingS: 5 };
    updateFollowTarget(state, [null, 600, null, null], 1500, 0, DT_S);
    expect(state.allMissingS).toBe(0);
  });
});
