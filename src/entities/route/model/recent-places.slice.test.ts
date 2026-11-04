// Tests recent places: newest first, no duplicates, at most ten.
import { describe, expect, it } from 'vitest';

import {
  recentPlaceAdded,
  recentPlacesRestored,
  recentPlacesSlice,
  selectRecentPlaces,
} from './recent-places.slice';

const KELOWNA = { name: 'Kelowna', lng: -119.4966, lat: 49.888 };
const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };

describe('recentPlacesSlice', () => {
  it('puts the newest place first and moves a repeated place to the front', () => {
    let state = recentPlacesSlice.reducer(undefined, recentPlaceAdded(KELOWNA));
    state = recentPlacesSlice.reducer(state, recentPlaceAdded(SUMMERLAND));
    state = recentPlacesSlice.reducer(state, recentPlaceAdded(KELOWNA));
    expect(selectRecentPlaces({ recentPlaces: state })).toEqual([KELOWNA, SUMMERLAND]);
  });

  it('keeps only the ten most recent places', () => {
    let state = recentPlacesSlice.getInitialState();
    for (let index = 0; index < 12; index += 1) {
      state = recentPlacesSlice.reducer(
        state,
        recentPlaceAdded({ name: `P${String(index)}`, lng: 0, lat: 0 }),
      );
    }
    expect(state.places).toHaveLength(10);
    expect(state.places[0]?.name).toBe('P11');
  });

  it('restores persisted places, capped at ten', () => {
    const many = Array.from({ length: 15 }, () => KELOWNA);
    expect(recentPlacesSlice.reducer(undefined, recentPlacesRestored(many)).places).toHaveLength(
      10,
    );
  });
});
