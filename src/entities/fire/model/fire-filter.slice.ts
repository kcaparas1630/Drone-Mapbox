// Whether the fire feed includes fires that are Out: off at launch, switched by the HUD toggle (behaviour §7).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FireFilterState = { isOutIncluded: boolean };

const initialState: FireFilterState = { isOutIncluded: false };

export const fireFilterSlice = createSlice({
  name: 'fireFilter',
  initialState,
  reducers: {
    outFiresVisibilityChanged(state, action: PayloadAction<boolean>) {
      state.isOutIncluded = action.payload;
    },
  },
  selectors: {
    selectIsOutIncluded: (state) => state.isOutIncluded,
  },
});

export const { outFiresVisibilityChanged } = fireFilterSlice.actions;

export const { selectIsOutIncluded } = fireFilterSlice.selectors;
