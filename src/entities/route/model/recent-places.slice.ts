// The last 10 places flown to, newest first, persisted with the prefs (behaviour §5.4, §8).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Place } from './place.schema';

export type RecentPlacesState = { places: Place[] };

const MAX_RECENT_PLACES = 10;
const SAME_PLACE_TOLERANCE_DEG = 1e-6;

const initialState: RecentPlacesState = { places: [] };

// Returns true when two places share a name and practically the same coordinates.
function isSamePlace(first: Place, second: Place): boolean {
  return (
    first.name === second.name &&
    Math.abs(first.lng - second.lng) < SAME_PLACE_TOLERANCE_DEG &&
    Math.abs(first.lat - second.lat) < SAME_PLACE_TOLERANCE_DEG
  );
}

export const recentPlacesSlice = createSlice({
  name: 'recentPlaces',
  initialState,
  reducers: {
    recentPlaceAdded(state, action: PayloadAction<Place>) {
      const others = state.places.filter((place) => !isSamePlace(place, action.payload));
      state.places = [action.payload, ...others].slice(0, MAX_RECENT_PLACES);
    },
    recentPlacesRestored(state, action: PayloadAction<Place[]>) {
      state.places = action.payload.slice(0, MAX_RECENT_PLACES);
    },
  },
  selectors: {
    selectRecentPlaces: (state) => state.places,
  },
});

export const { recentPlaceAdded, recentPlacesRestored } = recentPlacesSlice.actions;

export const { selectRecentPlaces } = recentPlacesSlice.selectors;
