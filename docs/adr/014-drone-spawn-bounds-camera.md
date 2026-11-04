# ADR 014 — Spawn at last saved position (else BC centre), soft-clamped to BC; chase cam

Status: Accepted (2026-11-04)

## Options considered

Start and bounds:
1. Fixed BC centre, soft-clamped.
2. **Last saved position, else BC centre; soft-clamped.**
3. User geolocation if inside BC (permission prompt, Permissions-Policy change).
4. BC centre, no bounds.

Camera:
1. **Chase cam locked behind the drone** (bearing follows heading, pitch ~60°, zoom tied to
   altitude; mouse drag orbits temporarily then re-locks).
2. Chase cam + free-look toggle.
3. Top-down follow.
4. Free camera, drone tethered to screen centre.

## Decision

**Start option 2, camera option 1.** Position, heading and altitude are saved to `localStorage`
(versioned, zod-validated, throttled) and restored on launch; anything outside the BC bbox is
discarded and the default `BC_CENTRE` (Prince George area, configurable) is used. The drone's
velocity is damped to zero at the BC bounding box edge and the map has `maxBounds` with padding.

The chase camera is computed each frame with Mapbox `FreeCameraOptions`: position = drone −
forward × `FOLLOW_DISTANCE_M` + up × `FOLLOW_HEIGHT_M`, `lookAtPoint(drone)`. Distances scale with
speed so boosting pulls the camera back. A mouse/touch drag adds a temporary orbit offset that
eases back to zero after release.

## Consequences

- No geolocation permission, so `Permissions-Policy: geolocation=()` can be set.
- Only one camera model to keep correct; standard Mapbox drag-pan/scroll-zoom handlers are disabled.
