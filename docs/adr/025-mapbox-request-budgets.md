# ADR 025 — Client-side request budgets for the Mapbox APIs

Status: Proposed (2026-11-05) — awaiting owner review

## Context

FireflyBC runs on Mapbox's free tier. Every Mapbox call goes from the browser with the public
token (ADR 016); there is no backend to meter it. Four call paths are under our control:

| Call | Where | Today's throttle |
|---|---|---|
| Search Box suggest | `widgets/search-bar` (search-js-core) | 300 ms debounce, ≥ 2 characters |
| Search Box retrieve | `widgets/search-bar` | one per chosen suggestion |
| Geocoding v6 reverse | `entities/location` | one per new ~2 km cell, 800 ms settle |
| Terrain-DEM raster tiles | `entities/terrain` | ≤ 12 tiles per route, cached per tile |

Each path is throttled by design, but nothing caps it. A bug in an effect, a user holding a key
in the search box, or a long session of back-to-back routes can send requests without bound, and
a reload resets every in-memory cache. Map loads and the GL JS tile requests are not on this list:
the map is created once per page load (convention 006) and GL JS backs off on 429 itself.

## Options considered

1. **Per-API budgets in the browser: a sliding one-minute window plus a daily cap per browser,
   persisted in `localStorage`.** Stops bursts and runaway loops, survives reloads, needs no
   backend. Cannot see other users.
2. A proxy (Vercel function) that meters every request with a server-side counter. Real global
   protection, but it adds a backend, a secret token and a new failure point. Rejected by ADR 001
   (no backend in MVP).
3. Rely on Mapbox's own 429 responses. They protect Mapbox, not our free-tier allowance.

## Decision

Option 1.

- `createRequestBudget({ name, perMinute, perDay })` in `shared/lib/rate-limit` decides whether
  `count` more requests may go out. The minute window lives in memory (per tab). The daily count
  lives in `localStorage['fireflybc.quota.<name>.v1'] = { v: 1, day: 'YYYY-MM-DD', count }`
  (local date), shared by tabs, and resets at local midnight. Without storage it falls back to
  memory for the session.
- The four budgets are created once in `shared/api/mapbox-request-budgets.ts` from
  `shared/config/mapbox-request-limits.ts` *(tunable)*.
- Enforcement is at the call, before any network work:
  - `fetchJson(url, schema, { budget })` returns a `rate-limited` error without fetching.
  - DEM tiles reserve the whole batch of uncached tiles at once; a short budget fails the batch,
    so a route never spends half its tiles and still falls back.
  - Search Box suggest and retrieve take one unit each before calling the SDK.
- Over budget, each caller uses its existing failure path: the place name stays on the last
  value or "Over British Columbia" and retries after 60 s; the route keeps the great circle; the
  search box shows an inline message and recents still work.

## Consequences

- One user cannot run up the bill from one browser, by accident or by reloading.
- It does not protect the account from many users, or from someone copying the token. Those
  stay covered by the URL-restricted prod token, minimal scopes and the owner's Mapbox usage
  alerts (ADR 016, security §1). A server-side meter needs a backend and a new ADR.
- Clearing site data resets the daily count. That is acceptable for an accidental-overuse guard.
