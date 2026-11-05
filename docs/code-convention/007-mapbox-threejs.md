# 007 — Mapbox GL JS and three.js

## Rules

- One `mapboxgl.Map`, one custom layer (`id: 'drone-layer'`, `renderingMode: '3d'`), one
  `THREE.Scene`, one `THREE.WebGLRenderer` created in `onAdd(map, gl)` with
  `{ canvas: map.getCanvas(), context: gl, antialias: true }` and `autoClear = false`.
- `render(gl, matrix)`: `renderer.resetState()` before `renderer.render()`. Never call
  `renderer.setSize`, never clear the framebuffer, never allocate.
- **No allocation in the render loop.** Functions named `render`, `prerender`, `step*`, `tick`,
  `update*`, `sample*`, `apply*` under `widgets/map-view/**` and `entities/{drone,route,terrain,
  map-camera}/**` must not contain `new …`, `MercatorCoordinate.fromLngLat(`, array/object
  literals, spread, `.map(`/`.filter(`/`.slice(`, or closures. Use module-level scratch objects
  (`const scratchVec = new THREE.Vector3()`) and `InstancedMesh.setMatrixAt`.
- Every `onAdd` has a matching `onRemove` that disposes geometries, materials, textures and
  removes listeners. `map.remove()` in the widget cleanup.
- Handle `webglcontextlost` (pause loop, show message) and `webglcontextrestored` (re-add layer).
- Geo maths lives in `shared/lib/geo/*.ts` (haversine, bearing, destination point, mercator scale).
  No trigonometry in widgets or features.
- Map is created with `projection: 'mercator'`, `performanceMetricsCollection: false`,
  no `maxBounds` (it bounces the free camera on terrain, ADR 020), drag-pan/scroll-zoom/rotate
  handlers disabled; the chase camera owns the view via `map.setFreeCameraOptions`.
- Units: metres and radians inside the sim; degrees and lng/lat only at module edges.

## Enforcement

| Rule | What it checks |
|---|---|
| `local/no-alloc-in-render-loop` | the allocation ban inside the named functions/paths |
| `local/require-dispose-in-on-remove` | any object literal or class with `onAdd` also has `onRemove` that calls `.dispose()` (directly or via a `dispose*` function) at least once |
| `@typescript-eslint/no-restricted-imports` | `three` and `mapbox-gl` only inside `widgets/map-view/**`, `entities/{drone,fire,terrain,map-camera}/api/**`, `shared/lib/geo/**` |
| `no-restricted-syntax` | `new mapboxgl.Map(` or a value import of `Map` from `mapbox-gl` outside `widgets/map-view/**`; `Math.sin|cos|tan|asin|acos|atan|atan2(` outside `shared/lib/geo/**` and `entities/*/lib/**` |

Runs in `bun run lint` → Stop hook. Not auto-fixable.
