# 002 — One plain line says what a file or function does

Comments are one-liners in plain language. They say what the thing does, not how clever it is.

## Rules

- **Every source file** under `src/`, `e2e/`, `scripts/`, `eslint/` starts with one line comment:
  `// Fetches active wildfire points from the BCWS ArcGIS feed and validates them.`
  (`index.ts` files too: `// Public API of the fire entity.`)
- **Every function** (declaration, exported arrow function, class method longer than 3 lines) has
  exactly one `//` line directly above it. Inline callbacks passed as arguments are exempt.
- Format: starts with a capital letter, ends with a period, ≤ 120 characters, present tense,
  third person ("Returns…", "Clamps…", "Loads…"). No JSDoc blocks (`/** */`) — types already
  document parameters; JSDoc invites paragraphs.
- No decorative comments, no section banners, no commented-out code. `TODO(name): …` is allowed
  only with an owner and is counted (`scripts/count-todos.ts`, budget 20).
- A comment that repeats the function name adds nothing: `// Loads the drone.` above
  `loadDrone()` fails review; say what it loads from and what it returns.

## Examples

```ts
// Converts a longitude/latitude/altitude triple into Mapbox mercator units.
export function toMercator(lngLat: LngLat, altitudeMsl: number): MercatorPoint

// Steps free-flight physics forward by one fixed timestep using the current input vector.
export function stepFreeFlight(world: SimWorld, input: DroneInput, dtS: number): void
```

## Enforcement

| Rule | What it checks |
|---|---|
| `local/file-purpose-comment` | first token of each file is a single `//` line comment matching the format; `*.d.ts` exempt |
| `local/one-line-function-comment` | required single `//` line above the listed function kinds; rejects multi-line and `/** */` |
| `no-warning-comments` (`terms: ['fixme','hack','xxx']`) | banned markers |
| `scripts/count-todos.ts` | `TODO(` budget and owner presence |

Runs in `bun run lint` and `bun run check:scripts` → Stop hook. Not auto-fixable.
