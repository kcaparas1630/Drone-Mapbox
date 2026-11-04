# 005 — Redux

## Rules

- Redux Toolkit only: `createSlice`, `createAsyncThunk`, `createApi`, `createSelector`.
  No hand-written action types, reducers or `connect`.
- Store holds serialisable data only. `SimWorld`, the Mapbox map, three.js objects, timers,
  promises never enter the store. The default serialisability middleware stays on.
- Slices live in `entities/<slice>/model/<name>.slice.ts`; RTK Query APIs in
  `entities/<slice>/api/<name>.api.ts`; the store is assembled in `app/store.ts`.
- Components use `useAppSelector` / `useAppDispatch` from `@/shared/lib/redux` only.
- Action names are past-tense events: `routePlanned`, `droneSnapshotPublished`, `firePopupOpened`.
- Selectors that return new arrays/objects use `createSelector`.
- The frame loop reads the store with `store.getState()` at most once per fixed step and never
  calls `store.subscribe`. Only `app/` may call `subscribe`.
- Side effects go in thunks under `features/*/model/`; reducers stay pure.

## Enforcement

| Rule | What it checks |
|---|---|
| `no-restricted-imports` | `useSelector`, `useDispatch`, `useStore` from `react-redux` outside `shared/lib/redux`; `redux` core package |
| `no-restricted-syntax` | `store.subscribe(` outside `src/app/**`; `createStore(` anywhere |
| `local/redux-action-past-tense` | reducer names in `createSlice` end with `ed`/`en`/`t` past-tense suffix or are on the allowlist (`reset`, `clear` are not allowed — use `routeCleared`) |
| RTK serialisability + immutability middleware (dev/test) | throws on non-serialisable state or mutation |

Runs in `bun run lint` and unit tests → Stop hook.
