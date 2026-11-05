// The active auto-route in Redux with its planned path once ready; paused keeps it, cancel clears it (§6).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RoutePath } from './route-path.types';
import type { RoutePlan, RoutePlanDraft } from './route-plan.types';

export type RouteState = { activeRoute: RoutePlan | null; lastRouteId: number };

const initialState: RouteState = { activeRoute: null, lastRouteId: 0 };

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    routePlanned(state, action: PayloadAction<RoutePlanDraft>) {
      state.lastRouteId += 1;
      state.activeRoute = { ...action.payload, routeId: state.lastRouteId, path: null };
    },
    routePathPlanned(state, action: PayloadAction<{ routeId: number; path: RoutePath }>) {
      if (state.activeRoute?.routeId === action.payload.routeId) {
        state.activeRoute.path = action.payload.path;
      }
    },
    routeCleared(state) {
      state.activeRoute = null;
    },
  },
  selectors: {
    selectActiveRoute: (state) => state.activeRoute,
  },
});

export const { routePlanned, routePathPlanned, routeCleared } = routeSlice.actions;

export const { selectActiveRoute } = routeSlice.selectors;
