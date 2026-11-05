// Tests the fire filter: Out fires hidden at launch, shown and hidden again by the toggle.
import { describe, expect, it } from 'vitest';

import {
  fireFilterSlice,
  outFiresVisibilityChanged,
  selectIsOutIncluded,
} from './fire-filter.slice';

const { reducer } = fireFilterSlice;

describe('fireFilterSlice', () => {
  it('hides fires that are out at launch', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(selectIsOutIncluded({ fireFilter: state })).toBe(false);
  });

  it('shows fires that are out when switched on and hides them when switched off', () => {
    const shown = reducer(undefined, outFiresVisibilityChanged(true));
    expect(selectIsOutIncluded({ fireFilter: shown })).toBe(true);
    const hidden = reducer(shown, outFiresVisibilityChanged(false));
    expect(selectIsOutIncluded({ fireFilter: hidden })).toBe(false);
  });
});
