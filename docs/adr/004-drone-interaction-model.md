# ADR 004 — Free flight plus search-to-fly, with pause/resume on interrupt

Status: Accepted (2026-11-04)

## Context

"Navigate through the map with a drone" can mean a game-like vehicle, a click-to-fly cursor, or a
decorative marker. The owner also wants "I want to see Summerland" to fly the drone there.

## Options considered

Interaction model:
1. **Free flight** (WASD / touch joystick): controllable vehicle, camera follows.
2. **Click/search-to-fly**: animate to a destination; deterministic.
3. **Route-following via Mapbox Directions**: road polyline; billable; odd for a drone.
4. **Map-first with drone as marker**: cosmetic drone.

What happens when the user presses WASD during an auto-flight:
1. Cancel immediately, free flight.
2. **Pause; HUD shows Resume**; resume re-plans from the new position.
3. Ignore input; explicit Cancel only.
4. Cancel, keep destination in recents.

## Decision

**Hybrid of models 1 + 2** and **interrupt option 2**. The drone is always flyable; a search result
starts an auto-route; any manual input pauses it and a Resume button re-plans from wherever the
drone is now.

State machine (Redux `mode` slice):

```
            flyToPlace(destination)
  idle ------------------------------------> autoRoute
   |  any input                                 |  manual input
   v                                            v
 freeFlight <--- cancel / acknowledge ------ paused --- resume (re-plan) ---> autoRoute
   ^
   +---- arrived ----------------------------- autoRoute reaches destination
```

States: `idle | freeFlight | autoRoute | paused | arrived`. Transitions are reducers with guards.
Route planning is a pure function in `entities/route`, invoked from the `features/fly-to-place`
thunk. The frame loop only reads `mode`.

## Consequences

- Needs a `paused` state carrying the destination; cancel clears it.
- Controls must be ignored while the search box has focus (otherwise typing "w" flies the drone).
- Full control mapping, speeds and arrival behaviour are specified in `docs/behaviour.md`.
