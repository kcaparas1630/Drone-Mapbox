# ADR 016 — Two public Mapbox tokens: prod (URL-restricted) and dev (unrestricted, minimal scopes)

Status: Accepted (2026-11-04)

## Context

With no server, the Mapbox token ships in the bundle. Mapbox's model for this is a public `pk.`
token whose blast radius is limited by scopes and allowed URLs.

Verified (Mapbox docs, 2026-11-04):
- Allowed URLs do **not** support wildcards or IPs; subdomains and subpaths of an allowed URL are
  allowed; up to 100 URLs per token.
- A restricted token returns 403 when the request has **no `Referer` header**, so
  `Referrer-Policy` must not be `no-referrer`.
- `localhost` is blocked unless explicitly listed.

## Options considered

1. Per Vercel environment (prod / preview / dev) — three tokens.
2. **Two tokens: prod URL-restricted; dev unrestricted with minimal scopes, rotated.**
3. One token, URL-restricted (breaks localhost; people remove the restriction).
4. One unrestricted token (anyone can bill you).

## Decision

**Option 2.**

| Token | Allowed URLs | Scopes | Where |
|---|---|---|---|
| prod | `https://fireflybc.kcaparas.dev`, `https://fireflybc.vercel.app` (lowercase; hostnames are case-insensitive) | `styles:tiles`, `styles:read`, `fonts:read` only — untick `datasets:read`, `vision:read`, `datasources:read`; Search Box needs no extra scope | Vercel Production env |
| dev | none (unrestricted) | same minimal public scopes | `.env.local` (git-ignored), Vercel Preview + Development env, CI secret |

Rotation: dev token rotated quarterly or on any suspected leak; prod token rotated on leak (it is
public anyway; rotation mainly invalidates stale cached bundles).

## Consequences

- `Referrer-Policy: strict-origin-when-cross-origin` (sends the origin cross-site; enough to match).
- Token is baked into the bundle at build time; rotating it requires a redeploy, and users on a
  stale service worker will get 401s until the SW updates (`autoUpdate` + reload prompt on 401).
- Mapbox billing events to `events.mapbox.com` cannot be disabled and stay in the CSP.
