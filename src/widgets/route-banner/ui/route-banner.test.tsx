// Tests the route banner in each flight mode and that its buttons drive the mode machine.
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import {
  autoRouteStarted,
  droneInputStarted,
  droneModeSlice,
  droneSnapshotPublished,
  droneSnapshotSlice,
} from '@/entities/drone';
import { routePlanned, routeSlice } from '@/entities/route';

import { RouteBanner } from './route-banner';

const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };

// Builds a store in auto-route to Summerland, optionally paused by manual input.
function buildStore(isPaused: boolean) {
  const store = configureStore({
    reducer: combineSlices(droneModeSlice, droneSnapshotSlice, routeSlice),
  });
  store.dispatch(
    routePlanned({
      destination: SUMMERLAND,
      originLng: -123,
      originLat: 49,
      distanceM: 250_000,
      durationS: 45,
      initialBearingRad: 1.4,
    }),
  );
  store.dispatch(autoRouteStarted());
  store.dispatch(
    droneSnapshotPublished({
      lng: -121,
      lat: 49.5,
      altitudeMsl: 1500,
      altitudeAgl: 900,
      speedMps: 0,
      verticalSpeedMps: 0,
      headingDeg: 90,
      isAtBcEdge: false,
      isAtCeiling: false,
      isTerrainMissing: false,
      routeRemainingM: 0,
      routeRemainingS: 0,
      publishedAtMs: 0,
    }),
  );
  if (isPaused) {
    store.dispatch(droneInputStarted());
  }
  return store;
}

describe('RouteBanner', () => {
  it('shows the destination while flying and cancels to free flight', async () => {
    const store = buildStore(false);
    render(
      <Provider store={store}>
        <RouteBanner />
      </Provider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Flying to Summerland');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(store.getState().droneMode.mode).toBe('freeFlight');
    expect(store.getState().route.activeRoute).toBeNull();
  });

  it('offers Resume when paused and resumes the flight', async () => {
    const store = buildStore(true);
    render(
      <Provider store={store}>
        <RouteBanner />
      </Provider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Paused — Resume flight to Summerland?');
    await userEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(store.getState().droneMode.mode).toBe('autoRoute');
  });

  it('renders nothing without a route', () => {
    const store = configureStore({ reducer: combineSlices(droneModeSlice, routeSlice) });
    const { container } = render(
      <Provider store={store}>
        <RouteBanner />
      </Provider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
