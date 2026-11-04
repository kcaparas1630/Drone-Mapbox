# ADR 011 — Redux Toolkit + RTK Query; simulation state outside Redux

Status: Accepted (2026-11-04)

## Context

Mode, route, UI, preferences and the fire feed need app state. Drone position changes 60 times a
second and must not cause React renders.

## Options considered

State library: Zustand; XState + Zustand; Jotai; Context + useReducer; **Redux** (owner's
preference).
Redux flavour: **RTK + RTK Query**; RTK + createAsyncThunk; RTK + listener middleware; classic.

## Decision

**Redux Toolkit with RTK Query.** `createSlice` for `mode`, `route`, `ui`, `prefs`,
`droneSnapshot`; `createApi` for the BCWS feed with `pollingInterval` and `refetchOnReconnect`;
`createAsyncThunk` for feature thunks (`flyToPlace`, `resumeRoute`).

`SimWorld` (position, heading, velocity, terrain samples) is a plain mutable object owned by
`entities/drone` and read by the frame loop. A bridge publishes a snapshot to Redux at most 4 Hz.
The store keeps the default serialisability check; map and three.js objects are never stored.

## Consequences

- Typed hooks `useAppSelector` / `useAppDispatch` only (lint-enforced).
- The loop calls `store.getState()` once per step and never `subscribe`s (lint-enforced).
- Side effects live in thunks, not in reducers or middleware, to keep one pattern.
