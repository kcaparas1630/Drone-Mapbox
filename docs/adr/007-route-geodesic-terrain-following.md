# ADR 007 — Auto-route is a straight geodesic with terrain-following altitude

Status: Accepted (2026-11-04)

## Context

When the user searches "Summerland", the drone must fly there. BC is mountainous: a fixed cruise
altitude either clips into the Coast Range or is so high the map looks flat.

## Options considered

1. **Straight line at fixed cruise altitude.** Free, deterministic; clips mountains.
2. **Straight line, terrain-following.** Altitude = terrain + clearance along the way, sampled from
   Mapbox terrain DEM; realistic; needs terrain enabled and null-safe sampling.
3. **Mapbox Directions road route.** Billable, drone-on-highway look, no offline.
4. **User toggle direct/road.** Doubles the surface.

## Decision

**Option 2.** Path: great-circle between current position and destination (`@turf/along`,
`@turf/distance`, `@turf/bearing`). Altitude: a reactive controller, not a pre-planned 3D path:

```
targetAltMsl = max(terrain at 0, 1, 3, 6 km ahead along heading) + CLEARANCE_M
altMsl      -> eased toward targetAltMsl, climb/descent limited by MAX_VERTICAL_MPS
```

Terrain samples come from `map.queryTerrainElevation(lngLat, { exaggerated: false })`. A `null`
sample (tile not loaded) keeps the last known target and never lowers the floor. Numbers live in
`shared/config/flight-tuning.ts` (see `docs/behaviour.md §9`).

## Consequences

- No billable API; works with the same token scopes as the map.
- Lookahead points far outside the viewport may be `null`; the chase cam looks forward so the
  6 km point is usually loaded. Behaviour on sustained nulls is defined in `docs/behaviour.md`.
- The same controller provides the "terrain floor" in free flight.
