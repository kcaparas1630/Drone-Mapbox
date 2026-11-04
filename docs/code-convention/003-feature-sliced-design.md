# 003 — Feature-Sliced Design layout and import rules

## Layers and allowed imports

| Layer | May import from | Never from |
|---|---|---|
| `app` | pages, widgets, features, entities, shared | — |
| `pages` | widgets, features, entities, shared | app |
| `widgets` | features, entities, shared | app, pages, **other widgets** |
| `features` | entities, shared | app, pages, widgets, **other features** |
| `entities` | shared | everything above, **other entities** |
| `shared` | shared | everything above |

## Slice rules

- A slice is a folder directly under a layer (`entities/fire`). It contains only the segments
  `model/`, `api/`, `ui/`, `lib/`, `config/` and one `index.ts`.
- Other code imports a slice **only** through `@/entities/fire` (its `index.ts`). Deep imports
  (`@/entities/fire/model/fire.slice`) are errors.
- `shared` has segments directly (`shared/lib`, `shared/ui`, `shared/config`, `shared/api`,
  `shared/types`) and no business words except config constants.
- Pure logic in `entities/*/lib/**` and `entities/*/model/**` must not import `react`,
  `react-dom`, `mapbox-gl`, `three`, or touch `window`/`document`. The adapter that needs them goes
  in `api/` (e.g. `entities/terrain/api/sample-terrain-elevation.ts`).
- Cross-entity logic lives in a feature or in `widgets/map-view/model`.

## Planned slices (MVP)

```
app/        store.ts, providers/, register-pwa.ts, styles/globals.css, main.tsx, app.tsx
pages/      map-page
widgets/    map-view, hud, search-bar, fire-popup, route-banner, joystick
features/   control-drone, fly-to-place, pause-resume-route, select-fire
entities/   drone, route, fire, terrain, map-camera
shared/     config, lib, api, ui, types
```

## Enforcement

| Rule | What it checks |
|---|---|
| `boundaries/element-types` | layer direction table above; no same-layer cross-slice imports |
| `boundaries/entry-point` | imports into a slice go through `index.ts` only |
| `boundaries/no-unknown-files` | every file under `src/` belongs to a known layer/segment |
| `no-restricted-imports` override for `entities/*/{lib,model}/**` | bans react, react-dom, mapbox-gl, three |
| `no-restricted-globals` override for the same paths | bans `window`, `document`, `navigator`, `localStorage` |

Runs in `bun run lint` → Stop hook. Not auto-fixable.
