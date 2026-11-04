# ADR 018 — Documentation structure and documentation-before-code

Status: Accepted (2026-11-04)

## Decision

```
CLAUDE.md                      agent entry point: stack, commands, hard rules, pointers
docs/
  adr/                         one decision per file + index.md
  code-convention/             one convention per file + index.md; each names its enforcement
  behaviour.md                 what the app does, step by step, and every edge case
  security.md                  threat model, token policy, headers, validation, supply chain
  roadmap.md                   delivery order, spikes, definition of done
```

Rules:
- Documentation is written and reviewed by the owner **before** any code is written.
- Every code convention must have an ESLint rule or script that runs from `bun run check`, which
  the agent Stop hook executes. A convention without enforcement is a proposal, not a convention.
- Behaviour changes update `docs/behaviour.md` in the same PR. New decisions get a new ADR.

## Alternatives considered

Single `PLAN.md`; a shared Claude Doc; GitHub Issues for the roadmap. Rejected because the docs
must be versioned with the code and readable by agents working in the repo.
