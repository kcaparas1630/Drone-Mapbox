# ADR 017 — No error monitoring or analytics in MVP

Status: Accepted (2026-11-04)

## Options considered

1. Sentry browser SDK with source maps uploaded in CI.
2. Vercel Web Analytics + Speed Insights.
3. Both.
4. **None.**

## Decision

**Option 4.** Console only. A single `reportError(error, context)` function in
`shared/lib/report-error.ts` wraps `console.error` so a monitoring SDK can be dropped in later
without touching call sites.

## Consequences

- Field errors are invisible until reported by a person.
- CSP `connect-src` stays minimal (no Sentry/analytics hosts).
- Mapbox's own `performanceMetricsCollection` map option is set to `false`; billing events
  cannot be disabled.
