# 012 — Agent hooks: conventions run when the agent stops

The owner's requirement: every convention has a script or ESLint rule that runs when the agent's
Stop hook fires. An agent cannot end its turn with a violation in the tree.

## What runs

`bun run check` =
`bun run typecheck && bun run lint && bun run format:check && bun run test && bun run check:scripts`

`check:scripts` = `bun scripts/check-tests-exist.ts && bun scripts/count-todos.ts &&
bun scripts/count-eslint-disables.ts && bun scripts/check-no-secrets.ts`

E2E is excluded from the hook (minutes, needs a browser); CI runs it.

## Hook configuration (`.claude/settings.json`, committed)

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "bun scripts/stop-hook.ts", "timeout": 600 }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bun scripts/format-touched-file.ts", "timeout": 60 }
        ]
      }
    ]
  }
}
```

## `scripts/stop-hook.ts` behaviour

1. Read the hook JSON from stdin (`stop_hook_active`, `session_id`).
2. If no file under `src/`, `e2e/`, `scripts/`, `eslint/`, or config files changed since the
   last successful run (tracked in `.claude/.last-check-ok` by content hash), exit 0 — nothing to
   check.
3. Run `bun run check`. On success, write the hash and exit 0.
4. On failure: print the failing tool output to stderr and exit **2**. Claude Code blocks the stop
   and feeds stderr back to the agent, which must fix and try again.
5. Loop guard: a counter in `.claude/.stop-hook-attempts` (reset on success). After 3 consecutive
   failures the script exits 0 with a loud summary so the user sees it instead of an infinite loop.

## `scripts/format-touched-file.ts` behaviour

Reads `tool_input.file_path` from stdin; if it is a `.ts/.tsx/.css/.md/.json` file inside the
repo, runs `prettier --write` and `eslint --fix` on just that file. Exit 0 always (formatting must
never block an edit); real failures surface at Stop.

## Local ESLint rules (`eslint/local-rules/`)

Each rule is a TypeScript file built with `createRule` from `eslint/local-rules/create-rule.ts`, with a sibling test using `RuleTester`:

| Rule | Convention |
|---|---|
| `function-name-starts-with-verb` | 001 |
| `no-vague-identifier` | 001 |
| `no-vague-filename` | 001 |
| `file-purpose-comment` | 002 |
| `one-line-function-comment` | 002 |
| `redux-action-past-tense` | 005 |
| `no-alloc-in-render-loop` | 007 |
| `require-dispose-in-on-remove` | 007 |
| `fetch-through-shared-api` | 008 |
| `no-css-file-outside-app` | 009 |
| `one-value-export-per-file` | 013 |
| `related-type-exports-only` | 013 |

The plugin is loaded inline in `eslint.config.ts` (`plugins: { local: localRules }`); no npm
package needed.

## Enforcement of this convention

- `scripts/check-hooks-configured.ts` (part of `check:scripts`) asserts `.claude/settings.json`
  contains the Stop hook above and that every rule listed here exists in `eslint/local-rules/`
  and is referenced in `eslint.config.ts`.
- CI runs `bun run check` too, so a bypassed hook still fails the PR.
