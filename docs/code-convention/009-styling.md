# 009 — Styling

## Rules

- Tailwind v4 utility classes. Design tokens in `src/app/styles/globals.css` under `@theme`.
- Overlay theme is Canopy (ADR 023): forest-green panels, amber (`--color-primary`) as the only
  accent. Status colour lives on dots, footprints and flames, never on panel backgrounds.
- shadcn/ui components are copied into `src/shared/ui/<component>.tsx` and edited there; do not
  wrap them in another component just to restyle.
- `cn()` from `@/shared/ui/cn` for conditional classes; class order is Prettier's job.
- No inline `style` props, no CSS-in-JS, no `*.module.css`. The only other CSS file is
  `mapbox-gl.css` imported once in `app`.
- HUD layouts must work at 360 px width; interactive targets ≥ 44 × 44 px (`min-h-11 min-w-11`).
- Status colours always paired with text or an icon (never colour alone).

## Enforcement

| Rule | What it checks |
|---|---|
| `no-restricted-syntax` (`JSXAttribute[name.name='style']`) | inline styles |
| `@typescript-eslint/no-restricted-imports` | `styled-components`, `@emotion/*`, `*.module.css` |
| `prettier-plugin-tailwindcss` via `prettier --check` | class order |
| `local/no-css-file-outside-app` | `.css` imports outside `src/app/**` |

Runs in `bun run lint` and `bun run format:check` → Stop hook. Class order auto-fixes with
`bun run format`.
