# ADR 010 — Feature-Sliced Design, enforced by ESLint

Status: Accepted (2026-11-04)

## Options considered

1. **Flat feature folders.** Minimal ceremony; boundaries by convention only.
2. **Hexagonal core/adapters/ui.** Pure core; one lint rule.
3. **Feature-Sliced Design.** Layers with strict import direction and public APIs; enforced by
   lint; more naming decisions up front.
4. **Bun workspaces monorepo.** Overhead with no second app.

## Decision

**Option 3.** Layers `app → pages → widgets → features → entities → shared`, each slice with a
single `index.ts` public API. `eslint-plugin-boundaries` enforces layer direction, no cross-slice
imports within a layer, and entry points. Full rules in code-convention 003.

Planned slices:

```
src/app            store, providers, pwa registration, global styles, entry
src/pages          map-page
src/widgets        map-view, hud, search-bar, fire-popup, route-banner, joystick
src/features       control-drone, fly-to-place, pause-resume-route, select-fire
src/entities       drone, route, fire, terrain, map-camera
src/shared         config, lib, api, ui, types
```

## Consequences

- Cross-entity logic (e.g. route + terrain + drone) lives in a feature or the map-view widget's
  model, never in an entity.
- `shared` must not know the words drone/fire/route except as config constants.
