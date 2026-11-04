# 004 — TypeScript

## Rules

- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `moduleResolution: bundler`,
  `noFallthroughCasesInSwitch`, `isolatedModules`. Path alias `@/* → src/*`.
- No `any` (explicit or implicit). Use `unknown` and narrow with zod or a type guard.
- No non-null assertion `!` outside `*.test.ts`. Carry `null`/`undefined` through the type —
  `queryTerrainElevation` returns `number | null` and so does our wrapper.
- No `enum`; use `as const` objects + union types (`DroneMode = (typeof DRONE_MODES)[number]`).
- No `// @ts-ignore`; `// @ts-expect-error -- reason` only, counted against the disable budget.
- Prefer `type` for data shapes, `interface` only for extendable contracts.
- ESM only; `*.config.ts` with `export default`.

## Enforcement

| Rule | What it checks |
|---|---|
| `tsc -b --noEmit` | the compiler options above |
| `typescript-eslint` `strict-type-checked` + `stylistic-type-checked` | `no-explicit-any`, `no-unsafe-*`, `no-non-null-assertion`, `consistent-type-definitions`, `no-floating-promises`, `switch-exhaustiveness-check` |
| `@typescript-eslint/ban-ts-comment` (`ts-expect-error: allow-with-description`) | comment directives |
| `no-restricted-syntax` (`TSEnumDeclaration`) | bans `enum` |

Runs in `bun run typecheck` and `bun run lint` → Stop hook. Partially auto-fixable.
