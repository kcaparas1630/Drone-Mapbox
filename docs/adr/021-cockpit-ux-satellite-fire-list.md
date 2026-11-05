# ADR 021 — Cockpit UX: satellite basemap, nav cluster with compass and place name, fire list

Status: Proposed (2026-11-04) — amends the map style of ADR 005/007 and the HUD layout of behaviour §7;
awaiting owner review

## Context

Owner feedback on the MVP: the app is about fires, but nothing on screen says where they are. The
pilot cannot tell where they are or which way is north. A detailed 3D drone flies over a flat
vector map. Consumer drone apps (DJI Fly and similar) settle on one layout. The centre of the
screen stays clear for the view. Telemetry and an attitude/compass cluster sit in the lower-left
corner. Points of interest appear as markers with distance and direction.

## Options considered

Basemap:
1. **Mapbox Standard Satellite** (`mapbox://styles/mapbox/standard-satellite`): imagery with
   roads and place labels, same `basemap` import config as Standard (labels, light preset), so
   reduced detail keeps working. Heavier tiles.
2. Classic `satellite-streets-v12`: no Standard config, no light presets, older 3D pipeline.
3. Keep Standard (vector): light, but flat-looking under the 3D drone.

Where am I:
1. **Mapbox Geocoding v6 reverse lookup**, quantised to a ~2 km grid so the RTK Query cache
   doubles as the throttle: a few requests per minute of flight, zero while hovering.
2. Nearest rendered place label: free, but empty over wilderness and unreliable while tiles load.

Fires:
1. **A fire list panel**, sorted by distance from the drone, with direction relative to the
   heading. Clicking a row opens the existing popup; each row has a Fly button. **Fire blips on the
   compass ring** and **name labels on the map points**.
2. Off-screen edge arrows for every fire: noisy with 20+ fires; the compass blips give the
   same information in one place.

## Decision

Basemap option 1, place name option 1, fires option 1. The screen is laid out as a cockpit:

- **Top left:** FireflyBC wordmark, flight mode badge, edge/ceiling/detail notes.
- **Top centre:** search.
- **Right:** fire panel: feed freshness badge, status filter chips, a list sorted by distance,
  and the "Show fires that are out" toggle. It collapses to a button on small screens.
- **Lower left:** nav cluster. A compass rose rotates so the drone's heading is always up, with
  N/E/S/W marks and fire blips at their bearings within 150 km. Next to it: the place name
  ("Near Prince George, British Columbia"), coordinates, speed, vertical speed, altitude MSL/AGL
  and heading.
- **Bottom centre:** route banner. **Bottom right:** fire popup.

## Consequences

- One new request type on the public token: `GET https://api.mapbox.com/search/geocode/v6/reverse`
  (same host as tiles; CSP unchanged). Validated with zod like every other boundary.
- Satellite tiles cost more bandwidth. Reduced detail still hides labels via the `basemap` config.
- The HUD readouts move from the top-left card into the nav cluster. The mode badge and
  "Ready" text stay at top left, so the e2e smoke tests are unchanged.
