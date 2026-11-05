# 001 — Naming states responsibility

A name must tell the reader what the thing is responsible for, without opening it.
`get-location.ts`, `loadDrone()`, `fetchBCWildfireData()` — not `utils.ts`, `init()`, `getData()`.

## Rules

### Files and folders
- `kebab-case` always. Module files are `verb-noun` or `noun`: `fetch-bc-wildfire-data.ts`,
  `plan-geodesic-route.ts`, `drone-physics.ts`, `fire.schema.ts`, `fire.slice.ts`, `fire.api.ts`.
- One value export per non-index file; the file name matches it (`load-drone-model.ts` exports
  `loadDroneModel`). Component files: `fire-popup.tsx` exports `FirePopup`. Details and
  enforcement in 013.
- Folders name the slice or layer (`entities/fire`, `widgets/map-view`). Inside a slice only the
  FSD segments are allowed: `model`, `api`, `ui`, `lib`, `config`.
- Banned file/folder names (anywhere): `utils`, `util`, `helpers`, `helper`, `misc`, `common`,
  `stuff`, `temp`, `tmp`, `new`, `old`, `functions`, `handlers`, `manager`, `service`, `data`.
  Generic `types.ts` / `constants.ts` are banned too — name the content: `fire.types.ts`,
  `bc-bounding-box.ts`.

### Functions and methods
- `camelCase`, **starting with a verb** from the approved list (`eslint/approved-verbs.ts`):
  `get set load fetch build create make compute calculate parse validate normalize convert to from
  is has can should handle on use render update step tick apply clamp sample plan select reset
  start stop init register dispose format map filter sort find read write save restore persist
  publish subscribe emit dispatch resolve throttle debounce ensure assert serialize deserialize
  encode decode open close show hide toggle enable disable add remove insert delete clear merge
  split join project unproject scale rotate translate ease interpolate lerp move fly pause resume
  cancel arrive run report track measure describe` (edit the list in a PR, with reason).
- Acronyms keep their case: `fetchBCWildfireData`, `toMSLAltitude`. Hooks: `useX`. React
  components: `PascalCase` noun. Redux selectors: `selectX`. Thunks: verb phrase (`flyToPlace`).
- Booleans: `is/has/can/should` prefix. Event handlers: `handleX` (component) / `onX` (prop).
- Minimum identifier length 3, except loop/vector names `i j k x y z dt t` and the `cn()` class helper (009).

### Variables and constants
- `camelCase` variables; `UPPER_SNAKE_CASE` for module-level constants of primitive values
  (`CLEARANCE_M`, `BC_BBOX`). Types/interfaces/enums `PascalCase`, no `I` prefix.
- Units in the name when ambiguous: `altitudeMsl`, `altitudeAgl`, `speedMps`, `headingRad`,
  `bearingDeg`, `distanceM`, `timeoutMs`.
- Banned standalone identifiers: `data item items obj tmp temp foo bar baz stuff thing misc flag
  arr list str num val info res req cb fn callback handler manager helper util`. They are fine as
  part of a longer name (`fireData` is allowed; prefer `fires`).

## Examples

```ts
// ok
export function fetchBCWildfireData(signal: AbortSignal): Promise<Result<Fire[], FeedError>>
export function loadDroneModel(url: string): Promise<THREE.Group>
export function clampToBritishColumbia(world: SimWorld): void
const CLEARANCE_M = 300;

// not ok
export function init()            // no responsibility
export function getData()         // what data?
const data = await fetch(url)     // vague
// file: utils.ts, helpers.ts, types.ts
```

## Enforcement

| Rule | What it checks |
|---|---|
| `unicorn/filename-case` (`kebabCase`) | file names |
| `local/no-vague-filename` | banned file/folder names, generic `types.ts`/`constants.ts`, segment names inside slices |
| `@typescript-eslint/naming-convention` | camelCase/PascalCase/UPPER_SNAKE by kind; boolean prefixes; no `I` prefix |
| `local/function-name-starts-with-verb` | function declarations, exported arrow functions, methods; exempt PascalCase components and `use*` hooks |
| `local/no-vague-identifier` | banned standalone identifiers (exact match) |
| `id-length` (`min: 3`, exceptions `i j k x y z dt t cn`; property keys exempt) | short names |

All run in `bun run lint` → `bun run check` → Stop hook. Not auto-fixable; the agent renames.
