## What

<!-- One or two sentences: what changes for the user or the codebase. -->

## Why

<!-- The story, ADR or behaviour section this implements. -->

## How tested

<!-- `bun run check`, new unit tests, manual steps in the browser. -->

## Screenshot or GIF

<!-- Required for visual changes; delete otherwise. -->

Docs updated: <files> / none needed

New runtime dependency (one line each, convention 011): none

## Security checklist (docs/security.md §9)

- [ ] No new network host without adding it to CSP and this file.
- [ ] No new external input without a zod schema.
- [ ] No `dangerouslySetInnerHTML`, no `setHTML`, no string-built HTML.
- [ ] No new dependency without justification; lockfile updated.
- [ ] No token, `.env`, or secret in the diff (`check-no-secrets` passed).
- [ ] Behaviour doc updated if user-visible behaviour changed.
