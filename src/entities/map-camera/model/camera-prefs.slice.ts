// Camera preferences kept in Redux and persisted: the follow distance set with the wheel or pinch (§3.1, §8).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { CAMERA_TUNING } from '@/shared/config';

export type CameraPrefsState = { followDistanceM: number };

const initialState: CameraPrefsState = { followDistanceM: CAMERA_TUNING.FOLLOW_DISTANCE_M };

export const cameraPrefsSlice = createSlice({
  name: 'cameraPrefs',
  initialState,
  reducers: {
    followDistanceChanged(state, action: PayloadAction<number>) {
      const requestedM = Number.isFinite(action.payload)
        ? action.payload
        : CAMERA_TUNING.FOLLOW_DISTANCE_M;
      state.followDistanceM = Math.min(
        CAMERA_TUNING.MAX_FOLLOW_DISTANCE_M,
        Math.max(CAMERA_TUNING.MIN_FOLLOW_DISTANCE_M, requestedM),
      );
    },
  },
  selectors: {
    selectFollowDistanceM: (state) => state.followDistanceM,
  },
});

export const { followDistanceChanged } = cameraPrefsSlice.actions;

export const { selectFollowDistanceM } = cameraPrefsSlice.selectors;
