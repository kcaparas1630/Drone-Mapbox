# Behaviour specification

What the app does, step by step, and what happens at every edge. Numbers marked *(tunable)* live in
`src/shared/config/` and were not individually decided; everything else was decided in the ADRs.

## 1. Launch sequence

1. Shell loads (precached after first visit). If WebGL2 is unavailable → full-screen message
   "This browser can't render 3D maps" with a list of supported browsers. Stop.
2. `import.meta.env` is validated; a missing `VITE_MAPBOX_TOKEN` fails fast with a developer
   message (never a blank map).
3. Saved drone state is read from `localStorage` (`fireflybc.drone.v1`). Valid and inside BC → use it;
   otherwise `BC_CENTRE` (Prince George area, *(tunable)*), heading north, altitude
   `DEFAULT_ALT_AGL_M` above terrain *(tunable, 500 m)*.
4. Map is created: Standard style, `projection: 'mercator'`, terrain on (`mapbox-dem`),
   `maxBounds` = BC bbox + 1° padding, Mapbox interaction handlers off, `minZoom` 4.
5. Custom layer `drone-layer` is added on `style.load`; the drone GLB is loaded (a wireframe
   placeholder shows until it arrives). Mode = `idle`.
6. Fire feed fetch starts in parallel (RTK Query). HUD shows "Loading fires…".
7. Frame loop starts. The chase cam snaps to the drone (no animation on launch).
8. Online check: if `navigator.onLine` is false, a persistent banner says "Offline — the map and
   search need a connection"; fires show whatever is cached in memory (nothing on cold start).

## 2. Modes

`idle | freeFlight | autoRoute | paused | arrived` (ADR 004). HUD always shows the current mode.

| From | Event | To | Side effects |
|---|---|---|---|
| idle | any drone input | freeFlight | — |
| idle / freeFlight / arrived | `flyToPlace` (search retrieve, recent, or fire "Fly here") | autoRoute | plan route, HUD banner "Flying to {name}" |
| autoRoute | manual drone input | paused | drone keeps momentum then obeys input; banner shows **Resume** / **Cancel** |
| paused | Resume | autoRoute | re-plan from current position to same destination |
| paused | Cancel / Esc | freeFlight | route cleared |
| autoRoute | within `ARRIVAL_RADIUS_M` *(tunable, 150 m)* of destination | arrived | drone hovers, camera orbits slowly, arrival card with destination name + "Fires within 25 km: N" |
| arrived | any input or Dismiss | freeFlight | — |
| any | search box focused | (unchanged) | drone input disabled while focused |

## 3. Free flight

### 3.1 Controls (desktop) *(tunable mapping in `shared/config/drone-controls.ts`)*

| Key | Action |
|---|---|
| W / ↑ | thrust forward |
| S / ↓ | brake, then reverse at half thrust |
| A / ← , D / → | yaw left / right |
| Space | climb |
| Shift | descend |
| Ctrl (hold) | boost ×4 |
| Esc | cancel route / close popup / dismiss arrival |
| / or Ctrl+K | focus search |
| R | reset camera orbit offset |

Mouse drag on the map = temporary camera orbit (yaw ±90°, pitch 30–75°) that eases back over
1.5 s after release. Scroll wheel = follow distance within [30 m, 400 m].

### 3.2 Controls (touch)

Left virtual joystick (forward/back + yaw), right vertical slider (climb/descend), boost button,
search button. Joystick is a custom pointer-events component (no dependency). Multi-touch drag on
the map = orbit, pinch = follow distance.

### 3.3 Physics *(tunable)*

- Fixed timestep 1/60 s; frame `dt` clamped to 50 ms; accumulator pattern.
- Max ground speed 150 m/s (boost 600 m/s), acceleration 60 m/s², drag brings speed to zero in
  ~2 s with no input. Yaw rate 90°/s, with a visual bank angle up to 25° (render-only).
- Vertical speed max 60 m/s, altitude range: `[terrain + 30 m, 12 000 m MSL]`.
- Terrain floor: altitude is pushed up smoothly if the drone would fall below terrain + 30 m
  (uses the same lookahead sampler as auto-route, so mountains ahead lift the drone).
- Heading and position use geodesic maths (bearing/destination on a sphere), not flat offsets, so
  long flights stay correct at 60° N.

### 3.4 Bounds

A soft clamp: within 5 km of the BC bbox edge the outward velocity component is scaled down to
zero at the edge; the drone never leaves the bbox. The HUD shows "Edge of British Columbia" while
clamped. `maxBounds` on the map prevents the camera from showing much beyond it.

## 4. Chase camera (ADR 014)

Each frame: camera position = drone position − forward × `FOLLOW_DISTANCE_M` (60 m, scaled by
`1 + speed/maxSpeed`) + up × `FOLLOW_HEIGHT_M` (25 m); `lookAtPoint(drone)`. Applied with
`map.setFreeCameraOptions`. Orbit offset from drag is added to the forward vector before placement.
`prefers-reduced-motion` disables orbit easing and bank animation.

## 5. Search → fly (ADR 008)

1. User focuses the search box (keyboard input to the drone is suspended). A Search Box session
   opens on first keystroke.
2. Suggestions are limited to BC (`bbox`, `country=ca`) and biased to the drone's position.
3. On selection, the retrieve feature is validated: must have `geometry.coordinates` inside the
   BC bbox; otherwise toast "That place is outside British Columbia" and nothing flies.
4. `flyToPlace({ name, lngLat })` is dispatched → mode `autoRoute`, destination stored, pushed
   to recents (last 10, persisted).
5. Search box blurs; drone control returns to the loop.

## 6. Auto-route

### 6.1 Path and speed

- Path: great-circle from current position to destination. Progress is a distance along the path.
- Trip duration = `clamp(distance / CRUISE_MPS, MIN_TRIP_S, MAX_TRIP_S)` *(tunable: 400 m/s,
  5 s, 45 s)* with ease-in/ease-out, so Vancouver → Summerland (~300 km) takes ~45 s and the
  camera pulls back proportionally to speed so the ground is readable.
- Heading turns toward the path bearing at up to 180°/s at the start (visible banking turn),
  then follows the great-circle bearing, which changes along the way.

### 6.2 Terrain-following altitude (ADR 007)

```
samples = terrain at 0 km, 1 km, 3 km, 6 km ahead along current heading (null-safe)
target  = max(known samples) + CLEARANCE_M (300 m)       -- never below the previous target
         + speedFactor × 500 m                           -- higher when faster, for visibility
altMsl  = approach target with max vertical rate 120 m/s, eased
```

### 6.3 Null terrain samples

`queryTerrainElevation` returns `null` for unloaded tiles. Rules: ignore nulls in the max; if
**all** samples are null for > 2 s, hold the current altitude and raise the target by 100 m per
second until a sample returns (fail-safe upward); never descend on missing data. The HUD altitude
readout shows "—" for AGL while samples are missing.

### 6.4 Pause and resume

- Any drone input while in `autoRoute` → `paused` immediately. The drone keeps its velocity and
  responds to input; the route line stays drawn faded.
- Banner: "Paused — Resume flight to Summerland? [Resume] [Cancel]". Resume re-plans from the
  current position with the same destination (fresh duration). Cancel clears the route.
- Pausing does not change the camera model.

### 6.5 Arrival

Within `ARRIVAL_RADIUS_M` → `arrived`: velocity eases to zero, drone hovers at target altitude,
camera orbits at 10°/s. Arrival card: destination name, "Fires within 25 km: N (nearest: X, Y km,
status)". Any input or Dismiss → `freeFlight`.

## 7. Fires (ADR 003, 015)

- Fetch on launch, poll every 10 min, refetch on reconnect; 10 s timeout; paginated.
- HUD badge: "Fires: N · updated 4 min ago" (relative time ticks each minute). Over 30 min old
  (feed failing) → amber "Fire data may be stale"; over 2 h → red; never silently blank.
- Representation: hit-test circle layer + 3D beacons (status palette in ADR 015). Beacon height
  scales with `CURRENT_SIZE` (log scale, clamped) and with zoom so distant fires remain visible.
- Hover (desktop) → cursor pointer + tooltip with name and status. Click/tap → popup card:
  fire number, incident name, status badge, size (ha), ignition date (local time), approximate
  location, cause, "Fly here" button, "Open on BC Wildfire Service ↗" (allow-listed host only).
- "Fly here" dispatches `flyToPlace` to the fire's coordinates.
- Filter: `Out` fires excluded by default; a HUD toggle "Show fires that are out" re-queries
  without the filter (post-MVP if time is short; the toggle is the only planned filter).
- Disclaimer in the popup footer: "Informational only. Source: BC Wildfire Service open data,
  fetched {time}. For emergencies follow EmergencyInfoBC."

## 8. Persistence

- `localStorage['fireflybc.drone.v1'] = { v: 1, lng, lat, altMsl, headingRad, savedAt }` written at
  most every 2 s while moving and on `pagehide` / `visibilitychange: hidden`.
- `localStorage['fireflybc.prefs.v1'] = { v: 1, recents: [...≤10], followDistanceM }`.
- Invalid or outside-BC values are discarded with a `console.warn` via `reportError`.

## 9. Tunables (`src/shared/config/`)

| Constant | Default | File |
|---|---|---|
| `BC_BBOX` | `[-139.06, 48.30, -114.03, 60.00]` | `bc-bounding-box.ts` |
| `BC_CENTRE` | `[-122.75, 53.92]` | `bc-bounding-box.ts` |
| `DEFAULT_ALT_AGL_M` | 500 | `flight-tuning.ts` |
| `MAX_SPEED_MPS` / `BOOST_MULTIPLIER` | 150 / 4 | `flight-tuning.ts` |
| `CLEARANCE_M` / `MIN_AGL_M` | 300 / 30 | `flight-tuning.ts` |
| `CRUISE_MPS`, `MIN_TRIP_S`, `MAX_TRIP_S` | 400, 5, 45 | `flight-tuning.ts` |
| `ARRIVAL_RADIUS_M` | 150 | `flight-tuning.ts` |
| `FOLLOW_DISTANCE_M` / `FOLLOW_HEIGHT_M` | 60 / 25 | `camera-tuning.ts` |
| `FIRE_POLL_MS` | 600 000 | `fire-feed.ts` |
| `FIRE_STALE_WARN_MS` / `FIRE_STALE_ERROR_MS` | 1 800 000 / 7 200 000 | `fire-feed.ts` |

## 10. Edge cases and required behaviour

### Environment
| Case | Behaviour |
|---|---|
| No WebGL2 | Static message, no map, no loop |
| WebGL context lost | Loop pauses, overlay "Graphics context lost — restoring…"; on restore, layer re-added, state intact |
| Low-end device (< 30 fps for 5 s) | Beacon pulse disabled, DPR capped at 1.5, label layer hidden; HUD note "Reduced detail" |
| Tab hidden / backgrounded | rAF stops; on return `dt` clamp prevents teleport; fire poll timer continues (RTK Query) |
| Window blur with keys held | All keys released on `blur` and `visibilitychange` |
| Resize / orientation change | Map resizes; joystick re-lays out; camera unaffected |
| 360 px wide phone | HUD collapses to badges; search is full-width overlay |

### Network and data
| Case | Behaviour |
|---|---|
| Offline at launch | Shell loads, offline banner, map blank with message, search shows recents only, no fires |
| Goes offline mid-flight | Drone keeps flying over already-loaded tiles; banner; fires remain; search disabled; terrain nulls follow §6.3 |
| Mapbox 401/403 (bad or rotated token, missing referer) | Overlay "Map unavailable (auth)" + developer hint in console; prompts reload if a newer SW is waiting |
| Mapbox 429 | Back-off handled by GL JS; HUD note if tiles stall > 10 s |
| BCWS feed down / 5xx / timeout | Keep last data; stale badge escalates; retry on next poll |
| BCWS returns 200 with `{error}` | Schema rejects; treated as feed error |
| BCWS schema change (missing field) | Zod fails → feed error, UI shows "Fire data unavailable", app keeps working |
| Unknown `FIRE_STATUS` value | Grey beacon, raw text shown |
| `exceededTransferLimit` on last page | Pagination loop continues until false; hard cap 10 pages |
| Fire with invalid coordinates / outside BC | Dropped during normalise with a counted warning |
| Duplicate `FIRE_NUMBER` | Last one wins; counted warning |
| Huge feed (> 10 MB) | `fetchJson` aborts; feed error |
| Search returns place outside BC | Toast; no flight |
| Search 429 / network error | Inline error in the box; drone unaffected |

### Input and modes
| Case | Behaviour |
|---|---|
| Typing in search while flying | Drone input suspended; keys never reach the loop |
| Input during `autoRoute` | → `paused` (§6.4) |
| Resume when destination now equals current position | → `arrived` immediately |
| Destination at the bbox edge | Route planned; clamp keeps the drone inside; arrival radius check still succeeds |
| Esc during popup and route | Closes popup first; second Esc cancels route |
| Gamepad connected | Ignored in MVP |

### Geometry and simulation
| Case | Behaviour |
|---|---|
| Crossing high latitude (60° N) | Geodesic maths; mercator scale applied per frame when converting to scene units |
| Very short route (< 300 m) | Duration = `MIN_TRIP_S`; no banking turn |
| Terrain sample null forever (DEM blocked) | Fail-safe upward (§6.3); drone never clips |
| Altitude above 12 000 m | Clamped; HUD shows ceiling |
| Saved position corrupt / outside BC | Default spawn; warning |
| Drone GLB fails to load | Wireframe placeholder stays; error reported; everything else works |
| Drone GLB wrong orientation/scale | Corrected by constants in `entities/drone/config/drone-model.ts` (spike item) |

### PWA and lifecycle
| Case | Behaviour |
|---|---|
| New version deployed | SW `autoUpdate`; toast "Updated — reload" when the new SW is waiting; auto-reload only when a Mapbox 401 suggests a rotated token |
| Install prompt | Shown via HUD button when `beforeinstallprompt` fires; never auto-prompt |
| Storage quota error | Persistence silently disabled for the session; warning |

### Security-relevant (details in `docs/security.md`)
| Case | Behaviour |
|---|---|
| Feed text contains HTML/script | Rendered as text by React; never HTML |
| `FIRE_URL` host not allow-listed | Link omitted; fire number shown as text |
| Token missing at build | Build fails (`env.ts` validation at startup, `check-no-secrets` prevents committing one) |
