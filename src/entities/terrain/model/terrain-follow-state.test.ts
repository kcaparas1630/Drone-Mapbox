// Tests that a new terrain-follow state has no target and no missing time.
import { describe, expect, it } from 'vitest';

import { createTerrainFollowState } from './terrain-follow-state';

describe('createTerrainFollowState', () => {
  it('starts without a target', () => {
    expect(createTerrainFollowState()).toEqual({ targetMsl: null, allMissingS: 0 });
  });
});
