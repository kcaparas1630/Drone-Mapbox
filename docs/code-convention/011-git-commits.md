# 011 — Git, commits, and pull requests

## Rules

- Branches: `feat/<slice>-<thing>`, `fix/…`, `chore/…`, `docs/…`. Never commit directly to `main`.
- Conventional Commits with the slice as scope:
  `feat(drone): add terrain-following altitude controller`,
  `docs(adr): supersede 006 with offline ghost map`.
- One feature per PR. PR body: what, why, how tested, screenshot/GIF for visual changes, and
  "Docs updated: <files> / none needed".
- `bun run check` green locally before push; CI re-runs it plus e2e. Never `--no-verify`.
- `bun.lock` committed; CI installs with `--frozen-lockfile`. Dependency bumps are their own PRs
  with a one-line justification per new runtime dependency.
- `.env*` never committed except `.env.example`.
- Agents do not commit, push, merge, deploy, or rotate tokens unless the owner asks in that session.

## Enforcement

| Tool | What it checks |
|---|---|
| `commitlint` (`@commitlint/config-conventional`, scope-enum = slice names) via `simple-git-hooks` `commit-msg` | commit format |
| `simple-git-hooks` `pre-push` → `bun run check` | checks before push |
| GitHub Actions `ci.yml` | `bun install --frozen-lockfile`, `bun run check`, `bun run test:e2e`, `bun audit` via `bun run check:audit` (fails on high/critical; Bun 1.2 has no level flag) |
| `.gitignore` + `scripts/check-no-secrets.ts` (greps staged files for `pk.`/`sk.` tokens and `.env`) in `pre-commit` | secrets |
| Branch protection on `main` (owner configures) | PR + green CI required |
