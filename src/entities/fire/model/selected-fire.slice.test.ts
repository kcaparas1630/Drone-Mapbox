// Tests opening and closing the fire popup selection.
import { describe, expect, it } from 'vitest';

import {
  fireDeselected,
  fireSelected,
  selectedFireSlice,
  selectSelectedFireNumber,
} from './selected-fire.slice';

describe('selectedFireSlice', () => {
  it('selects a fire by number and deselects it', () => {
    const selected = selectedFireSlice.reducer(undefined, fireSelected('K52001'));
    expect(selectSelectedFireNumber({ selectedFire: selected })).toBe('K52001');
    const cleared = selectedFireSlice.reducer(selected, fireDeselected());
    expect(cleared.fireNumber).toBeNull();
  });
});
