# Security

A static SPA with no backend and no user data. The assets at risk are: our Mapbox bill, the user's
browser (XSS/clickjacking), the integrity of what we tell people about wildfires, and our build
pipeline.

## 1. Threat model

| Threat | Impact | Control |
|---|---|---|
| Mapbox token copied from the bundle and used elsewhere | Our bill | URL-restricted prod token, minimal scopes, rotation (ADR 016); Mapbox usage alerts set by the owner |
| Dev token leaked (repo, CI logs, screenshots) | Our bill | `.env.local` git-ignored; `check-no-secrets` pre-commit; CI secret masked; rotate quarterly |
| Malicious or malformed BCWS feed content | XSS, crash | zod at boundary, React text rendering only, no `setHTML`, URL host allowlist |
| Malicious Search Box response | XSS | zod on retrieve, text rendering |
| Clickjacking / framing | Phishing overlay | `frame-ancestors 'none'`, `X-Frame-Options: DENY` |
| Supply-chain compromise of a dependency | Everything | Lockfile + `--frozen-lockfile`, `bun audit` in CI, Dependabot weekly, no `postinstall` without review, dependency justification rule |
| Stale service worker serving an old bundle | Broken app after token rotation | `autoUpdate`, reload prompt on 401 |
| Misinformation (user treats data as live/official) | Safety | Timestamp + source + disclaimer on every fire surface; link to BCWS |
| Local storage tampering | Weird spawn | Schema-validated, bbox-checked, non-sensitive only |

Out of scope for MVP: authentication, PII, server-side anything.

## 2. Tokens (ADR 016)

- Public `pk.` tokens only; never a `sk.` token anywhere in this repo or CI.
- Prod token: allowed URLs `https://fireflybc.kcaparas.dev` and `https://fireflybc.vercel.app`
  only; scopes `styles:tiles`, `styles:read`, `fonts:read` and nothing else (Search Box works
  with any public token; `datasets`, `vision`, `datasources` unticked).
- Dev token: no URL restriction, same minimal scopes; stored in `.env.local`, the CI secret
  `MAPBOX_DEV_TOKEN`, and Vercel Preview/Development env.
- `src/shared/config/env.ts` is the only reader of `import.meta.env`; it validates the token
  shape (`/^pk\./`) and fails fast.
- Rotation runbook: create new token → update Vercel env → redeploy → delete old token → verify
  preview and prod load → note date in this file.

| Rotation log | Token | Date |
|---|---|---|
| — | — | — |

## 3. Response headers (`vercel.json`)

Deployed first as `Content-Security-Policy-Report-Only` on a preview, verified in DevTools with a
full flight + search + popup, then enforced.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://services6.arcgis.com;
  worker-src 'self' blob:;
  child-src blob:;
  manifest-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

Why each unusual line:
- `'wasm-unsafe-eval'` — Mapbox Standard style / 3D uses WebAssembly.
- `style-src 'unsafe-inline'` — Mapbox GL and the Search JS component inject inline styles; no
  nonce path exists for them. Tailwind itself does not need it.
- `worker-src blob:` — Mapbox GL's ESM bundle spawns a blob worker; the CSP-strict bundle is an
  option if we ever drop `blob:`.
- `events.mapbox.com` — billing events that cannot be disabled.
- `Referrer-Policy` must send the origin, or the URL-restricted token returns 403.
- No `report-uri`/`report-to` in MVP (no monitoring, ADR 017).

## 4. Input validation (code-convention 008)

- `fetchJson(url, schema, …)` — schema is required; response size capped at 10 MB; 10 s timeout;
  `content-type` must include `json`.
- BCWS: `FeatureCollection` schema with a strict `properties` object (unknown keys stripped),
  status mapped to our union with a fallback, coordinates checked against the BC bbox, `FIRE_URL`
  parsed with `new URL()` and host compared to `wildfiresituation.nrs.gov.bc.ca`.
- Search Box: retrieve feature schema; coordinates inside BC.
- `localStorage`: versioned schema; anything failing is discarded.
- Rendering: React text nodes only; `react/no-danger` lint; Mapbox `Popup` is not used.
- External links: `target="_blank" rel="noopener noreferrer"`.

## 5. Dependencies and build

- `bun.lock` committed; CI and Vercel install with `--frozen-lockfile`.
- `bun audit` runs in CI; high/critical fails the build.
- Dependabot: weekly, grouped minor/patch; majors are separate PRs with a changelog read.
- New runtime dependency requires a one-line justification in the PR (convention 011) — size,
  maintenance, and what we would write instead.
- Draco decoder, fonts, and any third-party static assets are self-hosted under `public/`
  (no CDN script tags; `script-src 'self'`).
- Source maps are not uploaded or served in production (no monitoring to use them; hides nothing
  secret but reduces bundle-size and surface).

## 6. Service worker

- Precache only build output and `public/` assets; `runtimeCaching: []`.
- `navigateFallback: '/index.html'` with a denylist for `/api/*` (unused, defensive).
- Same-origin only; `clientsClaim` + `skipWaiting` via `autoUpdate`.
- The SW never sees Mapbox or ArcGIS requests (no fetch handler for cross-origin).

## 7. Privacy

- No geolocation, no accounts, no analytics, no cookies.
- Mapbox collects anonymised usage events (cannot be disabled); the attribution control stays
  visible so users can reach Mapbox's telemetry opt-out. `performanceMetricsCollection: false`.
- Search queries go to Mapbox under their privacy policy; recents are stored locally only.

## 8. Abuse and cost controls

- Search Box: a session opens only on first keystroke after focus; input debounced 300 ms, min 2
  characters; the SDK closes sessions on retrieve.
- Fire feed: poll every 10 min (upstream cache is 5 min); in-flight requests aborted on unmount.
- Mapbox: owner sets a usage alert at the free-tier boundary in the Mapbox dashboard.
- Vercel: default DDoS protection; no functions to abuse.

## 9. PR security checklist (copied into the PR template)

- [ ] No new network host without adding it to CSP and this file.
- [ ] No new external input without a zod schema.
- [ ] No `dangerouslySetInnerHTML`, no `setHTML`, no string-built HTML.
- [ ] No new dependency without justification; lockfile updated.
- [ ] No token, `.env`, or secret in the diff (`check-no-secrets` passed).
- [ ] Behaviour doc updated if user-visible behaviour changed.
