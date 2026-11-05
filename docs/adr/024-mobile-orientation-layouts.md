# ADR 024 — Mobile layouts: collapsed portrait with a rotate notice, compact landscape cockpit

Status: Proposed (2026-11-05) — amends the small-screen notes of ADR 021 and behaviour §4.1;
awaiting owner review

## Context

Owner feedback from a phone (412 × 915 CSS px, portrait): the cockpit stacks into one column.
The search bar, the open fire list, the nav cluster and both touch sticks cover most of the map,
and the view the app exists for is a narrow strip. Turning the phone sideways does not help: the
layout only knows "under 640 px wide" or not, so a landscape phone gets the desktop rows plus the
sticks, and the fire list is squeezed to almost nothing by a 360 px tall viewport.

## Options considered

Detecting a phone:
1. **Media queries in JS** (`useSyncExternalStore` over `matchMedia`): primary pointer is coarse
   (`pointer: coarse`) and the short side is under 640 px, plus `orientation: portrait`. Updates
   live on rotation, no listeners on `resize`, testable with a stubbed `matchMedia`.
2. Width breakpoints only (Tailwind `sm:`): a narrow desktop window would get the phone layout and
   a landscape phone would get the desktop one, which is today's bug.
3. User-agent sniffing: brittle, and it cannot see orientation.

Portrait:
1. **Collapse everything and show a notice at the centre** asking the user to turn the phone,
   with "Continue in portrait" so a locked orientation never blocks the app.
2. Force landscape with the Screen Orientation API: only works in fullscreen, unsupported on iOS.
3. Keep the stacked layout: rejected by the owner.

Landscape:
1. **The desktop cockpit, smaller**: same positions (brand and search on top, fire panel on the
   right, nav cluster lower left, route banner bottom centre), compact sizes, and the touch sticks
   along the bottom of the area left of the fire panel.
2. A bottom sheet for the fire list: hides fires behind a gesture; the panel is the point of the app.

## Decision

Detection option 1, portrait option 1, landscape option 1.

- `useViewportLayout()` in `shared/lib/browser` returns `desktop | mobile-landscape |
  mobile-portrait`. Tablets (short side ≥ 640 px) and any device with a fine primary pointer keep
  the desktop layout.
- The map page picks one overlay per layout. The map itself is never re-created; only the overlay
  re-mounts on rotation, so a widget's local state (search text, status chip) resets then.
- Widgets take size props (`isCompact`, `isCollapsed`, `variant`) instead of reading the media
  queries themselves, so the decision lives in one place.
- The portrait notice is dismissed for the session only (React state, nothing persisted).

## Consequences

- No new dependency, no CSS media query duplicated in JS: the phone query lives in one hook.
- Rotation re-mounts the overlay widgets; fire selection, route and drone state live in Redux or
  the simulation and are unaffected.
- Notched phones: the landscape overlay pads by `env(safe-area-inset-*)` (the page already uses
  `viewport-fit=cover`).
