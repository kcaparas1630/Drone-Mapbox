# ADR 012 — ESLint + Prettier + Vitest + Playwright

Status: Accepted (2026-11-04)

## Options considered

1. Biome + Vitest + Playwright (fast; fewer React/FSD rules; no custom rule API comparable to ESLint).
2. **ESLint + Prettier + Vitest + Playwright** (most rules; custom rules possible; FSD boundary plugin).
3. Biome + Vitest only (no e2e).
4. oxlint + Prettier + Vitest + Playwright (maturing).

## Decision

**Option 2.** ESLint 10 flat config with `typescript-eslint` (strict, type-checked),
`eslint-plugin-react-hooks`, `eslint-plugin-boundaries` (FSD), `eslint-plugin-unicorn`
(filename case), and a local plugin in `eslint/local-rules/` implementing the conventions that no
published rule covers (naming, one-line comments, render-loop allocations, fetch boundary).
Prettier 3 with `prettier-plugin-tailwindcss`. Vitest 5 for unit/component tests, Playwright for
smoke e2e in Chromium with SwiftShader.

Every code convention names the rule or script that enforces it (code-convention index), and the
whole set runs from `bun run check`, which the agent Stop hook executes (code-convention 012).

## Consequences

- Slightly slower lint than Biome; acceptable for a single app.
- Custom rules need their own unit tests (`eslint/local-rules/*.test.ts`).
- TypeScript 7 is current; if `typescript-eslint` does not yet support it at bootstrap, pin TS 6.x.
