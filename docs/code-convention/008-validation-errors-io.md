# 008 — Validation, errors, and I/O boundaries

## Rules

- Every value that enters from outside is parsed with zod before use and converted to our own
  type: BCWS ArcGIS GeoJSON, Search Box retrieve features, `localStorage` blobs (versioned
  `{ v: 1, … }`), `import.meta.env`. Schemas live in `<slice>/model/<name>.schema.ts`.
- All network calls go through `shared/api/fetch-json.ts`:
  `fetchJson(url, schema, { signal, timeoutMs = 10_000, maxBytes = 10 MB })` — the schema argument
  is mandatory, so unvalidated JSON cannot exist. RTK Query's `baseQuery` wraps the same function.
- `localStorage` is accessed only through `shared/lib/storage/read-versioned-item.ts` /
  `write-versioned-item.ts`, which take a schema.
- Boundary functions return `Result<T, E>` from `shared/lib/result.ts` or throw a typed error
  class (`FeedError`, `SearchError`, `StorageError`). No empty `catch {}`; a catch either converts
  to a `Result`, rethrows, or calls `reportError`.
- `console.log` is banned; `console.warn`/`console.error` only through
  `shared/lib/report-error.ts`.
- Links from external data are rendered only when the URL parses and its host is on the allowlist
  (`wildfiresituation.nrs.gov.bc.ca`); `rel="noopener noreferrer"`, `target="_blank"`.
- ArcGIS returns HTTP 200 with `{ "error": {…} }`; the feed schema rejects that shape.

## Enforcement

| Rule | What it checks |
|---|---|
| `local/fetch-through-shared-api` | global `fetch(` outside `src/shared/api/**` |
| `no-restricted-globals` | `localStorage`, `sessionStorage`, `indexedDB` outside `src/shared/lib/storage/**` |
| `no-restricted-properties` | `JSON.parse` outside `src/shared/{api,lib/storage}/**` |
| `no-empty` (`allowEmptyCatch: false`) | empty catch |
| `no-console` | all console use outside `shared/lib/report-error.ts` |
| `@typescript-eslint/no-floating-promises`, `no-misused-promises` | unhandled async |
| `fetchJson` / storage function signatures | schema is a required parameter (type-level enforcement) |

Runs in `bun run lint` and `bun run typecheck` → Stop hook.
