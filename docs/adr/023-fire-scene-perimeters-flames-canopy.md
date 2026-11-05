# ADR 023 — Fire scene: scorched perimeters, status-scaled flames, select-then-fly; Canopy theme

Status: Proposed (2026-11-04) — amends the beacons of ADR 015 and the overlay tokens of convention 009;
awaiting owner review

## Context

The 3D beacons from ADR 015 are coloured pillars. They show where a fire is, but not what it
looks like or how big it is. The owner wants to "really see the fire": a scorched area sized like
the real fire, the owner-supplied flame model (`public/models/fire.glb`) floating over it, both
visible from kilometres away and clickable. ADR 015 rejected perimeters for their payload. The
BCWS perimeter layer (`BCWS_FirePerimeters_PublicView`) proved small: ≈ 100 KB for every
non-Out perimeter, simplified to ~50 m.

The overlay panels also need a theme. The owner compared black, "Canopy" (deep forest green) and
"Warm paper" (cream).

## Options considered

Footprint:
1. **Real perimeter polygon where BCWS has one, else a circle of the reported area**, draped on
   the terrain as a charred fill with a status-coloured edge. The circle is marked approximate.
2. Circle for every fire: simpler, but wrong for long, narrow fires.

Flame:
1. **`fire.glb` instanced per fire, scaled by status:** out of control / new / Fire of Note full,
   being held 60 %, under control a 35 % ember, out none. The footprint carries the size. A
   minimum on-screen height of ~32 px keeps far fires visible and clickable, and a translucent
   ghost copy drawn without the depth test keeps fires behind ridges visible and clickable.
2. The same full flame for every fire: 20 of 22 current fires are under control, so the map
   would overstate the danger (security §1, misinformation).

Click:
1. **Select first:** clicking a flame or point selects the fire. The fire list scrolls to it and
   highlights it, and its details card opens under the list. "Fly here" starts the route.
2. Fly immediately: rejected by the owner; a stray click would launch a flight.

Theme:
1. **Canopy:** panels `#1C2B22` at 94 % with blur, border `#3A5243`, text `#F8FAFC` / `#A9BCAE`
   (≈ 7:1), inactive chips `#24382B` / `#D7E2D9`, amber `#F59E0B` as the only accent.
2. Warm paper: highest contrast, but over satellite imagery the cream panels become the
   brightest thing on screen and glare at night.

Camera framing (found while testing): the chase camera looked about 23° down at the drone, so the
top of the screen was below the horizon and fires beyond ~20 km were off-screen at any size.
1. **Aim at a point `LOOK_AHEAD_M` (40 m) ahead of the drone:** the horizon shows, the drone sits
   a little below centre, and distant fires are on screen. This is the framing drone apps use.
2. Keep looking at the drone and add off-screen arrows: more UI for something the view can show.

## Decision

Footprint 1, flame 1, click 1, theme 1, camera 1. The circle-layer hit test and hover tooltip from ADR 015
stay. The beacon columns and halos are replaced by the flames.

## Consequences

- A second BCWS request, polled with the fire feed:
  `BCWS_FirePerimeters_PublicView/FeatureServer/0/query` (same host, CSP unchanged). It is
  validated with zod, and polygons outside the BC bbox are dropped.
- Flames are picked by projecting each flame's box to the screen on click. There is no three.js
  raycast, and nothing is allocated in the render loop.
- Status colour is carried only by the footprint edge, the dots and the flames, never by the
  panel colour.
