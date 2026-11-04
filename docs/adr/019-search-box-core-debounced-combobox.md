# ADR 019 — Search Box API through search-js-core with a debounced combobox

Status: Proposed (2026-11-04) — amends the component choice of ADR 008; awaiting owner review

## Context

ADR 008 chose the Mapbox Search Box API and the `<SearchBox>` component from
`@mapbox/search-js-react`. `docs/security.md` §8 requires input debounced 300 ms with a minimum of
2 characters. Reading the installed SDK (search-js-web 1.6.0, `index-esm.js`) shows the web
component creates its `SearchSession` with a debounce of **0 ms** and suggests on every keystroke
longer than 2 characters; the session is private, so the debounce cannot be configured.

## Options considered

1. **Keep `<SearchBox>`** and accept one `/suggest` request per keystroke (billing is per session,
   but the 10 req/s rate limit and request volume are higher than planned).
2. **`@mapbox/search-js-core` (`SearchBoxCore` + `SessionToken`) with our own combobox.** Same API,
   same per-session billing (one token per focus → retrieve), 300 ms debounce, aborts stale
   requests, no injected component CSS, Tailwind styling, our own accessible listbox.
3. Wrap `<SearchBox>` and throttle by toggling `interceptSearch` — fragile, relies on internals.

## Decision

**Option 2.** `@mapbox/search-js-react` is replaced by its own dependency `@mapbox/search-js-core`.
Everything else in ADR 008 stands: Search Box API, `country=ca`, BC `bbox`, proximity to the drone,
`language=en`, zod-validated retrieve, outside-BC toast, recents in prefs.

## Consequences

- We own the combobox (keyboard navigation, ARIA roles, focus rules) and its tests.
- A session token is created on focus and discarded after retrieve or blur, matching the billing
  model in ADR 008.
