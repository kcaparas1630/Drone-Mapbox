# ADR 001 — Overall architecture

Status: Accepted (2026-11-04)

## Context

We are building an MVP: fly a 3D drone over a Mapbox map of British Columbia, search a place and
fly there, and see active wildfires from the BC Wildfire Service (BCWS). The app must be cheap to
run, safe to expose publicly, and simple enough that agents can implement it from these docs.

## Options considered

1. **Static SPA, no backend.** All APIs (Mapbox, BCWS) called from the browser. Public Mapbox
   token restricted by URL/scopes. Cheapest; no server to secure; keys are public by design.
2. **SPA + thin backend (BFF).** Proxy/cache BCWS and Mapbox calls. Hides nothing important
   (Mapbox tokens are public anyway), adds a deployable and an attack surface.
3. **Server-rendered app (Next.js).** SSR brings nothing to a WebGL map; heavier.

## Decision

**Option 1.** A static single-page app on Vercel. No backend, no auth, no database.

### Runtime shape

```
React UI (HUD, search, popup) <-- Redux store --> RTK Query (fire feed)
        |  dispatch                 ^ 4 Hz snapshot          | poll every 10 min
        v                           |                        v
Input (keys/joystick) --> SimWorld (mutable, 60 fps) --> Mapbox custom layer (three.js)
                              |                          drone mesh + fire beacons
                              v
                        Mapbox GL JS Map (mercator, terrain, Standard style, FreeCamera)
```

Three state domains, deliberately separate:

| Domain | Owner | Rate | Holds |
|---|---|---|---|
| `SimWorld` | `entities/drone` plain TS object | every frame | position (lng, lat, altMsl), heading, velocity, input vector, terrain samples, route progress |
| Redux store | `app/store` | on events + 4 Hz bridge | `mode` machine, `route`, `ui`, `prefs`, throttled `droneSnapshot`, RTK Query fire cache |
| Map / three.js | `widgets/map-view` | every frame | `mapboxgl.Map`, `THREE.Scene`, drone mesh, `InstancedMesh` beacons |

Rules: React never reads `SimWorld`; it reads `droneSnapshot`. The loop never subscribes to the
store; it calls `store.getState()` once per fixed step for `mode` and `route`.

### Frame loop (lives in `widgets/map-view/model/run-frame-loop.ts`)

```
onAnimationFrame(t):
  dt = clamp(t - last, 0, 50 ms)                 // hidden tab must not teleport the drone
  for each fixed 1/60 s step:
    input = readDroneInput()                     // zero when search focused or window blurred
    mode  = store.getState().mode
    freeFlight | paused -> stepFreeFlight(world, input)
    autoRoute           -> stepAutoRoute(world)
    sampleTerrainAhead(world, map)               // queryTerrainElevation at 0/1/3/6 km, null-safe
    applyAltitudeRules(world)                    // terrain floor (free) or follow target (auto)
    clampToBritishColumbia(world)
  updateChaseCamera(map, world)                  // FreeCameraOptions: behind and above, lookAt drone
  map.triggerRepaint()                           // custom layer draws drone + beacons
  publishDroneSnapshot(world)                    // <= 4 Hz
  saveDronePosition(world)                       // <= 0.5 Hz and on pagehide
```

## Consequences

- Every secret-looking value in the bundle is public; see ADR 016 and `docs/security.md`.
- Upstream shape changes (BCWS) hit the client directly; zod validation at the boundary is
  mandatory (code-convention 008).
- Adding a proxy later is a Vercel Function plus a one-file change in `entities/fire/api`.
