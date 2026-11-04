// The active auto-route in Redux; paused keeps it, cancel clears it (ADR 004, behaviour §6.4).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RoutePlan, RoutePlanDraft } from './route-plan.types';

export type RouteState = { activeRoute: RoutePlan | null; lastRouteId: number };

const initialState: RouteState = { activeRoute: null, lastRouteId: 0 };

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    routePlanned(state, action: PayloadAction<RoutePlanDraft>) {
      state.lastRouteId += 1;
      state.activeRoute = { ...action.payload, routeId: state.lastRouteId };
    },
    routeCleared(state) {
      state.activeRoute = null;
    },
  },
  selectors: {
    selectActiveRoute: (state) => state.activeRoute,
  },
});

export const { routePlanned, routeCleared } = routeSlice.actions;

export const { selectActiveRoute } = routeSlice.selectors;
