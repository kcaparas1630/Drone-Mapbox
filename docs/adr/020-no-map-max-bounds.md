# ADR 020 — No map `maxBounds`; the BC soft clamp alone bounds the view

Status: Proposed (2026-11-04) — amends the map `maxBounds` of ADR 014; awaiting owner review

## Context

ADR 014 gave the map `maxBounds` (BC bbox + 1° padding) next to the drone's soft clamp. In flight
the chase camera bounced: the drone jumped hundreds of pixels off-centre, sometimes off-screen,
then snapped back. Probing the app in Chrome while flying from the default spawn showed that the
camera Mapbox renders drifts vertically from the pose passed to `setFreeCameraOptions`. The error
flips sign every frame and grows: up to 64 m and 583 px flying straight, and 73 m and 1,119 px
while climbing. Removing `maxBounds` at runtime brought both to 0 in every case.

The cause is inside mapbox-gl 3.34. With `maxBounds` set, `Transform._constrain()` recomputes the
centre's x through a modulo (`(x + shift + worldSize) % worldSize - shift`). Rounding makes that
differ from x on some frames, so `_constrain()` re-assigns `center`. With terrain on, the centre
setter calls `_updateCameraOnTerrain()`, which swaps the centre altitude for the DEM height at a
point placed on the previous frame's altitude plane. That lifts or drops the whole camera. On
sloped ground the stale altitude feeds back with a gain above 1. The drone itself never leaves
its path, because only the view moves.

## Options considered

1. **Drop `maxBounds`.** The drone is already clamped to the BC bbox (ADR 014) and the chase
   camera stays within a few kilometres of it, so the view cannot wander off BC.
   `maxBounds` only limits the ground point at screen centre, never what shows towards the horizon.
2. Keep `maxBounds` and switch the transform's private `cameraElevationReference` to `"sea"` so
   the centre setter skips `_updateCameraOnTerrain()`. This relies on Mapbox internals that can
   change in any minor release.
3. Keep `maxBounds` and drive the camera with `jumpTo` (centre/zoom/pitch/bearing) instead of
   `FreeCameraOptions`. The centre setter runs on every call, so the same terrain correction
   applies and the bounce stays.

## Decision

**Option 1.** The map is created without `maxBounds`; `BC_BOUNDING_BOX.PADDING_DEG` is removed.
Everything else in ADR 014 stands: spawn rules, the soft clamp at the bbox edge, and the chase
camera through `FreeCameraOptions`.

## Consequences

- The drone at the BC edge can see past it, towards the horizon, as it already could at any
  pitch.
- `e2e/chase-camera.spec.ts` flies the drone and fails if Mapbox moves the camera away from the
  chase-camera pose, so re-adding `maxBounds` is caught in CI.
