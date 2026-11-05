# Code conventions

Rule of this folder: **a convention without enforcement is a proposal.** Every convention names
the ESLint rule or script that checks it. All of them run from `bun run check`, which the agent
Stop hook executes (convention 012), so an agent cannot finish a task with a violation present.

| # | Convention | Enforced by | Auto-fix |
|---|---|---|---|
| [001](001-naming.md) | Names state responsibility: `get-location.ts`, `loadDrone()`, `fetchBCWildfireData()` | `unicorn/filename-case`, `@typescript-eslint/naming-convention`, `local/function-name-starts-with-verb`, `local/no-vague-identifier`, `local/no-vague-filename`, `id-length` | no |
| [002](002-comments.md) | One plain line above every file and every function saying what it does | `local/file-purpose-comment`, `local/one-line-function-comment` | no |
| [003](003-feature-sliced-design.md) | FSD layers, slices, single public API | `boundaries/dependencies` (layers + entry points), `boundaries/no-unknown-files`, `@typescript-eslint/no-restricted-imports` (pure entity logic) | no |
| [004](004-typescript.md) | Strict TypeScript, no `any`, no `!` | `tsc -b --noEmit`, `typescript-eslint` strict-type-checked | partial |
| [005](005-redux.md) | RTK only, serialisable store, typed hooks, loop never subscribes | `@typescript-eslint/no-restricted-imports`, `no-restricted-syntax`, RTK serialisability middleware | no |
| [006](006-react.md) | Function components, named exports, hook rules, cleanup | `react-hooks/*`, `@eslint-react/*`, `import-x/no-default-export`, `no-restricted-syntax` (component shape) | partial |
| [007](007-mapbox-threejs.md) | No allocation in the render loop; dispose; one map, one scene | `local/no-alloc-in-render-loop`, `local/require-dispose-in-on-remove` | no |
| [008](008-validation-errors-io.md) | zod at every boundary; `fetchJson` only; no empty catch; no `console.log` | `local/fetch-through-shared-api`, `no-restricted-globals`, `no-empty`, `no-console`, `fetchJson` signature requires a schema | no |
| [009](009-styling.md) | Tailwind utilities, shadcn in `shared/ui`, no inline styles | `no-restricted-syntax` (`style` prop), `prettier-plugin-tailwindcss`, `prettier --check` | yes |
| [010](010-testing.md) | Pure modules have sibling tests and ≥ 90 % coverage | `vitest run --coverage` thresholds, `scripts/check-tests-exist.ts` | no |
| [011](011-git-commits.md) | Conventional Commits, one feature per PR | `commitlint` via `simple-git-hooks` `commit-msg`; CI | no |
| [012](012-agent-hooks-enforcement.md) | Stop hook runs `bun run check`; PostToolUse formats touched files | `.claude/settings.json`, `scripts/stop-hook.ts` | — |
| [013](013-one-responsibility-per-file.md) | One responsibility per file: one value export, name matches file, 200-line limit | `local/one-value-export-per-file`, `local/related-type-exports-only`, `max-lines`, `max-lines-per-function`, `max-classes-per-file` | no |

## Commands

```
bun run check          typecheck + lint + format:check + unit tests (+ convention scripts)
bun run lint:fix       eslint --fix (only auto-fixable rules)
bun run format         prettier --write .
```

## Changing a convention

Edit the convention file *and* its rule in the same PR. Add or update the rule's test in
`eslint/local-rules/<rule>.test.ts`. If a rule produces false positives, fix the rule; do not
sprinkle `eslint-disable` (each disable needs a `-- reason` and is counted by
`scripts/count-eslint-disables.ts`, budget 10 repo-wide).
