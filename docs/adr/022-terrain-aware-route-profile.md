# ADR 022 — Auto-route: terrain-aware curved path and a planned climb–cruise–descent profile

Status: Proposed (2026-11-04) — amends the straight path and live altitude controller of ADR 007;
awaiting owner review

## Context

ADR 007 flies a straight great circle and chases a live altitude target built from terrain 0–6 km
ahead. Owner feedback: climbs and descents feel abrupt, and the drone goes straight over
mountains instead of around them. The live controller only sees the DEM tiles Mapbox has loaded
for the current view. It reacts late, so it cannot plan a smooth profile or a path around a ridge.
Drone mission planners (waypoint missions) work differently. They plan the whole path first,
climb to a cruise height, follow the terrain with smooth curved turns, and descend to the
destination.

## Options considered

1. **Plan at search time from DEM tiles we fetch ourselves.** Fetch the Mapbox terrain-DEM tiles
   (`mapbox.mapbox-terrain-dem-v1`, terrain-RGB) that cover the route corridor, at the coarsest zoom
   that keeps it to ≤ 12 tiles. Score a fan of curved candidate paths (quadratic Bézier, lateral
   offsets up to 45 % of the distance, ≤ 40 km) by their highest terrain plus a detour penalty.
   Build an altitude profile along the winner that climbs before ridges and eases down after
   them, inside a climb–cruise–descent envelope. Fly it with the existing eased timing.
2. Steer live around high terrain using the loaded tiles: no new requests, but routes run at up
   to ~10 km/s and loaded tiles reach a few km, so the drone would still meet ridges too late.
3. Mapbox Tilequery for elevations: one request per point, hundreds per route.

## Decision

**Option 1.** Planning is asynchronous: the route banner shows "Plotting route…" (≤ 10 s timeout).
If any tile fails, planning falls back to the straight great circle with the envelope profile. The
live terrain check still applies in flight: the drone never drops below the loaded terrain ahead
plus `MIN_AGL_M`. The path, the profile and the route line all come from the same planned
polyline.

## Consequences

- A second fetch helper in `shared/api`, `fetchImageBitmap(url)`. It has the same timeout, size
  cap and content-type check as `fetchJson`, and returns a decoded bitmap. Convention 008 lists
  both. The decoded heights are range-checked before use.
- A few raster tile requests per planned route (≈ 100 KB each), on `api.mapbox.com` (CSP unchanged).
- The route is a polyline of ≤ 256 points in Redux. The loop copies it into preallocated
  `SimWorld` buffers once per route, so the per-frame step still never allocates.
