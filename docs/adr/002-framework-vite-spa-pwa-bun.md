# ADR 002 — Vite SPA + vite-plugin-pwa, Bun as package manager

Status: Accepted (2026-11-04)

## Context

The owner wants React, Bun, and an installable PWA. "Bun as bundler" only applies when using
`bun build` directly; with Vite or Next, Bun is the package manager and script runner.

## Options considered

1. **Vite SPA + `vite-plugin-pwa`.** Pure static build, Workbox service worker, no server.
   Simplest hosting and PWA story. Every API key is in the browser.
2. **Next.js App Router.** API routes for a proxy; PWA bolted on via serwist; SSR irrelevant for
   WebGL; Turbopack bundles, Bun only installs.
3. **Vite SPA + separate Bun/Hono backend.** Two deployables for a proxy we do not need yet.
4. **TanStack Start.** Vite-native with server functions; smaller ecosystem.

## Decision

**Option 1.** Vite 8 + React 19 + TypeScript, `vite-plugin-pwa` for the manifest and precache,
Bun 1.2 as package manager (`bun install --frozen-lockfile`) and script runner (`bun run …`).

## Consequences

- No place to hide secrets; Mapbox token strategy in ADR 016.
- Playwright's test runner needs Node; `bunx playwright test` respects the Node shebang, so Node 22
  must be installed locally and in CI.
- Service worker is disabled in dev (`devOptions.enabled: false`) to avoid stale-bundle confusion.
