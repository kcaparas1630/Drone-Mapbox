// Which fire's popup is open; the popup reads the fire itself from the feed cache by number (behaviour §7).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SelectedFireState = { fireNumber: string | null };

const initialState: SelectedFireState = { fireNumber: null };

export const selectedFireSlice = createSlice({
  name: 'selectedFire',
  initialState,
  reducers: {
    fireSelected(state, action: PayloadAction<string>) {
      state.fireNumber = action.payload;
    },
    fireDeselected(state) {
      state.fireNumber = null;
    },
  },
  selectors: {
    selectSelectedFireNumber: (state) => state.fireNumber,
  },
});

export const { fireSelected, fireDeselected } = selectedFireSlice.actions;

export const { selectSelectedFireNumber } = selectedFireSlice.selectors;
