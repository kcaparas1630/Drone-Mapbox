# 010 — Testing

## Rules

| Level | Tool | Covers | Location |
|---|---|---|---|
| Unit | Vitest | physics step, geodesic planning, terrain-follow controller, bounds clamp, zod schemas, normalisers, selectors, reducers, local ESLint rules | `*.test.ts` beside the source |
| Component | Vitest + Testing Library + jsdom | HUD, route banner, fire popup, search wrapper (SearchBox mocked) | beside the source |
| E2E smoke | Playwright, Chromium with SwiftShader flags | app loads and map canvas appears; search → mode becomes `autoRoute`; fire popup opens from a seeded fixture; manifest served | `e2e/*.spec.ts` |

- Every file in `src/entities/*/{lib,model}/**` and `src/shared/lib/**` has a sibling
  `*.test.ts`. Coverage threshold for those paths: 90 % lines, 85 % branches.
- Tests are deterministic: fixed `dt`, `vi.useFakeTimers()`, no network (`page.route()` fixtures
  for BCWS and Search Box in e2e; Mapbox tiles hit the real API with the dev token).
- Test names are sentences: `it('keeps the last target altitude when every terrain sample is null')`.
- No snapshot tests of DOM; assert behaviour.

## Enforcement

| Rule / script | What it checks |
|---|---|
| `vitest run --coverage` with `thresholds` scoped to the pure paths | coverage |
| `scripts/check-tests-exist.ts` | sibling test file for every pure module |
| `vitest/expect-expect`, `vitest/no-focused-tests`, `vitest/no-disabled-tests` | test hygiene |
| Playwright in CI (not in the Stop hook — too slow) | e2e |

`bun run test` runs in `bun run check` → Stop hook; `bun run test:e2e` runs in CI on every PR.
