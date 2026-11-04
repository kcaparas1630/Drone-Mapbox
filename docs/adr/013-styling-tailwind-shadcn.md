# ADR 013 — Tailwind v4 + shadcn/ui

Status: Accepted (2026-11-04)

## Options considered

1. **Tailwind v4 + shadcn/ui.** Copy-in components (command palette, badge, dialog, button); no
   runtime UI library.
2. Tailwind only.
3. CSS Modules / vanilla CSS.
4. Panda CSS / vanilla-extract.

## Decision

**Option 1.** `@tailwindcss/vite` plugin, design tokens in `src/app/styles/globals.css` via
`@theme`, shadcn components copied into `src/shared/ui` and edited there. `cn()` helper for
conditional classes. Mapbox GL CSS imported once in `app`.

## Consequences

- HUD must work at 360 px width; touch targets ≥ 44 px.
- Class order enforced by `prettier-plugin-tailwindcss`; inline `style` props banned by lint
  (code-convention 009).
