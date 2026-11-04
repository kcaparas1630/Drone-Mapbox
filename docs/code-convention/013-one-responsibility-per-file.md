# 013 — One responsibility per file

A file does one thing, and its name says what that thing is (001). If you need the word "and" to
describe a file, split it.

## Rules

- A non-index file has **exactly one value export** (function, component, class, constant object,
  schema, slice, or API). Its name matches the file name (`plan-geodesic-route.ts` →
  `planGeodesicRoute`).
- Type-only exports may accompany it, but only types that belong to that export:
  `FirePopupProps` next to `FirePopup`, `Fire` next to `fireSchema`, `SimWorld` next to
  `createSimWorld`. Unrelated types go in their own `<name>.types.ts`.
- Allowed multi-export shapes, because they are one responsibility by construction:
  - `index.ts` — re-exports only, no logic.
  - `*.slice.ts` — the slice, its actions, its reducer, its selectors.
  - `*.api.ts` — the RTK Query api and its generated hooks.
  - `*.schema.ts` — one zod schema and its inferred type.
- Private helpers (not exported) are allowed only when they serve the single export and the file
  stays under the size limit; otherwise they become their own file.
- Size limits: 200 lines per file, 60 lines per function, 1 class per file. Hitting the limit is
  the signal to split, not to compress.
- No "barrel of unrelated things": a file never mixes a React component with a reducer, a fetch
  with a formatter, or physics with persistence.
- Tests mirror this: `<name>.test.ts` tests only `<name>.ts`.

## Examples

```
entities/drone/lib/step-free-flight.ts        exports stepFreeFlight
entities/drone/lib/clamp-to-british-columbia.ts  exports clampToBritishColumbia
entities/drone/model/sim-world.ts             exports createSimWorld (+ type SimWorld)
entities/drone/model/drone-snapshot.slice.ts  slice shape, allowed
entities/fire/model/fire.schema.ts            fireSchema (+ type Fire)

// not ok
entities/drone/lib/drone-physics.ts           exports stepFreeFlight, clampToBritishColumbia, applyTerrainFloor
widgets/hud/ui/hud.tsx                        exports Hud, formatSpeed, useHudData
```

## Enforcement

| Rule | What it checks |
|---|---|
| `local/one-value-export-per-file` | exactly one value export outside the allowed shapes; export name matches the file name (camelCase/PascalCase of the kebab name); `index.ts` contains only `export … from` |
| `local/related-type-exports-only` | exported types in a single-export file share the export's name as prefix/suffix (`XProps`, `XOptions`, `XResult`, `X`) or the file is `*.types.ts` |
| `max-lines` (`200`, skip blank/comments) | file size |
| `max-lines-per-function` (`60`) | function size |
| `max-classes-per-file` (`1`) | classes |
| `scripts/check-tests-exist.ts` | `x.test.ts` imports only from `./x` |

Runs in `bun run lint` → Stop hook. Not auto-fixable; the agent splits the file.
