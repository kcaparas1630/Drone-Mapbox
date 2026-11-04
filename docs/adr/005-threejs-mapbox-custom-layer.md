# ADR 005 — three.js inside a Mapbox GL JS custom layer, mercator projection only

Status: Accepted (2026-11-04)

## Context

The drone (owner-supplied GLB) must be drawn in the map's 3D space so terrain and buildings occlude
it correctly and its altitude is real metres.

## Options considered

1. **Mapbox custom layer, shared WebGL context.** Official pattern (`renderingMode: '3d'`,
   `render(gl, matrix)`), three.js renders inside Mapbox's loop; correct occlusion; manual matrix
   maths; no extra dependency.
2. **Threebox.** Wrapper doing the same with helpers; less maintained, pinned to Mapbox versions.
3. **Separate three.js canvas overlaid on the map.** Simple; no occlusion; manual camera sync.
4. **react-three-fiber inside a custom layer.** R3F wants to own the canvas; fragile.

## Decision

**Option 1.** One custom layer `drone-layer` hosts one `THREE.Scene` containing the drone mesh and
an `InstancedMesh` of fire beacons. Positions are converted with
`MercatorCoordinate.fromLngLat(lngLat, altitudeMsl)`.

Verified constraints (Mapbox docs, 2026-11-04):
- Globe projection does not support `CustomLayerInterface` and Standard style defaults to globe at
  low zoom, so the map is created with `projection: 'mercator'`.
- Mapbox GL JS v3 requires WebGL2; unsupported browsers get a static message.
- Standard style / 3D features need `'wasm-unsafe-eval'` in the CSP `script-src`.
- `render()` must call `renderer.resetState()`, use `autoClear = false`, and never `setSize`.

## Consequences

- Terrain elevation for ground-anchored beacons comes from `map.queryTerrainElevation`, which
  returns `null` for unloaded tiles; beacons re-anchor when a value arrives.
- No per-frame allocations in `render()` (code-convention 007, lint-enforced).
- Camera uses Mapbox's `FreeCameraOptions` so the chase cam and the three.js projection agree.
