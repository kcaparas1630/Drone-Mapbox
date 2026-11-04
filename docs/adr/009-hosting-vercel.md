# ADR 009 — Vercel static hosting

Status: Accepted (2026-11-04)

## Options considered

1. **Cloudflare Pages.** Free, `_headers` for CSP, Workers later.
2. **Vercel.** Preview deploys per PR, headers via `vercel.json`, Functions later.
3. **GitHub Pages.** No custom response headers; CSP only as a meta tag.
4. **Netlify.** Equivalent to 1/2.

## Decision

**Option 2.** Framework preset Vite, output `dist/`, Bun detected from `bun.lock`. Security
headers (CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, frame-ancestors) in
`vercel.json`; exact values in `docs/security.md`.

Environment variables: `VITE_MAPBOX_TOKEN` — Production uses the prod token, Preview and
Development use the dev token (ADR 016). No other env vars in MVP.

## Consequences

- Preview URLs are not predictable, so they cannot be allow-listed on the prod token.
- CSP is first deployed as `Content-Security-Policy-Report-Only` on previews, then enforced.
