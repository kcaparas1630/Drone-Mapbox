# ADR 008 — Mapbox Search Box API via @mapbox/search-js-react

Status: Accepted (2026-11-04)

## Context

Users type a BC place name and the drone flies there. Search must stay inside BC and must not run
up a bill on every keystroke.

Verified (Mapbox docs, 2026-11-04): Search Box bills per **session** — a `session_token` groups
`/suggest` calls with the following `/retrieve`; a session also closes after 180 s idle or 50
suggests. Rate limit 10 requests/s. The Search JS SDK manages session tokens itself.

## Options considered

1. **Mapbox Search Box API.** Typeahead suggest + retrieve, bbox/country/proximity filters,
   per-session billing, best UX. Not offline.
2. **Mapbox Geocoding v6.** Per-request billing, simpler, weaker typeahead.
3. **Bundled BC gazetteer.** Offline, no token, places only.
4. **Gazetteer + Search Box.** Two result sources to merge.

## Decision

**Option 1.** `<SearchBox>` from `@mapbox/search-js-react` with
`country: 'ca'`, `bbox: BC_BBOX`, `proximity: <drone position>`,
`types: 'place,locality,region,district,poi,address'`, `language: 'en'`. `onRetrieve` dispatches
`flyToPlace` with the feature's coordinates and name. Recent results are kept in Redux `prefs`
(last 10) for one-tap re-flight.

## Consequences

- The component must mount lazily or stay idle until focused so no session opens on page load.
- Retrieve results are zod-validated before use (coordinates must fall inside the BC bbox; if not,
  show "Outside British Columbia" and do not fly).
- Search is unavailable offline; the box shows recents only.
