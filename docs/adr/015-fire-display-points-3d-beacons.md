# ADR 015 — Fires as hit-test points plus status-coloured 3D beacons

Status: Accepted (2026-11-04); beacons replaced by perimeters and flames in ADR 023 (proposed)

## Options considered

1. Points coloured by status, click → popup.
2. Points + perimeters (zoom-dependent; second feed, large payload).
3. Perimeters only (small fires vanish).
4. **Points + 3D beacons in three.js**, rendered in the same custom layer as the drone.

## Decision

**Option 4.** Two representations of the same `Fire[]`:

- A Mapbox GeoJSON source + circle layer (small dot + optional label) used for **hit-testing and
  hover/click**, since Mapbox handles picking reliably.
- A three.js `InstancedMesh` of beacons (vertical emissive column + pulsing halo) anchored at
  terrain elevation, coloured by status using the BCWS palette so users recognise it from their
  site: Out of Control `#FF0000`, Being Held `#FFFF00`, Under Control `#98E600`, New `#FC921F`,
  Fire of Note red with a distinct pulse; Out is filtered from the feed by default.

Clicking a point opens a React popup (not Mapbox `Popup.setHTML`) with name, status, size,
ignition date, approximate location, and a link to the BCWS incident page.

## Consequences

- Beacon scale is zoom-dependent so fires are visible from cruise altitude.
- ≤ 2 000 instances; matrices rebuilt only when data or terrain anchors change.
- Status strings outside the known set render grey with the raw text; they never crash the layer.
