# ADR 006 — Offline deferred; PWA is install-only in MVP

Status: Accepted (2026-11-04)

## Context

The owner wanted "offline-first" as a bonus. Mapbox documents offline map support only for its
mobile SDKs (tile packs, per-user limits) and its terms forbid proxying or intermediate caching of
map content; there are no browser (GL JS) offline terms at all. A service worker *can* cache tiles
technically; contractually it is not permitted. Everything else (app shell, fire data, drone
state) could be cached freely.

## Options considered

1. **Ghost map.** Keep Mapbox; offline shows cached fires + drone over a bundled BC outline on a
   blank style. No basemap offline.
2. **Mapbox + second local style over open PMTiles.** Low-zoom OpenStreetMap extract (open data,
   cacheable) served by the service worker when offline. One renderer, two styles, size spike.
3. **MapLibre + PMTiles, drop Mapbox.** Full offline basemap, no token, no billing; lose Search
   Box, Mapbox terrain and the Standard style.
4. **Defer offline entirely.** PWA installs and precaches the shell; no offline data promise.

## Decision

**Option 4.** `vite-plugin-pwa` precaches the built shell (JS, CSS, HTML, icons, drone GLB) with
`registerType: 'autoUpdate'` and an empty `runtimeCaching` list. Mapbox and ArcGIS responses are
never cached by the service worker.

## Consequences

- Opening the app offline shows the shell and a clear "You're offline — map needs a connection"
  state, not a broken map.
- The offline decision (options 1–3) is re-opened after the drone and fire layer are proven.
- Extension hooks left in place: `widgets/map-view/config/map-style.ts` is the only place the
  style URL lives; `entities/fire/api` is the only ArcGIS reader.
