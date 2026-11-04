# 006 — React

## Rules

- Function components only, declared as `export function FirePopup(props: FirePopupProps)`.
  No `React.FC`, no class components, no default exports (except `React.lazy` targets in `pages/`).
- Props are a named `type` ending in `Props`, declared in the same file.
- No `useEffect` to derive state from props or state; compute during render or in a selector.
- Effects that touch the map or the loop are idempotent and return a cleanup. The Mapbox map is
  created once in `widgets/map-view/ui/map-view.tsx` with `useRef` + `useEffect(…, [])` and is
  never re-created on re-render.
- Keyboard listeners are registered on `window` in `features/control-drone` and bail out when
  `document.activeElement` is an input, textarea, or contenteditable.
- No inline `style` props (see 009). No `dangerouslySetInnerHTML` anywhere.
- Components under `entities/*/ui` are presentational (no dispatch); `features/*/ui` and
  `widgets/*/ui` may dispatch.

## Enforcement

| Rule | What it checks |
|---|---|
| `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps` | hook usage |
| `react/function-component-definition` (`function-declaration`) | component shape |
| `import/no-default-export` (override allows `src/pages/**`) | named exports |
| `react/no-danger` | `dangerouslySetInnerHTML` |
| `react/forbid-component-props` + `react/forbid-dom-props` (`style`) | inline styles |
| `@typescript-eslint/ban-types` (`React.FC`) | component typing |
| `no-restricted-syntax` | `dispatch(` inside `src/entities/**/ui/**` |

Runs in `bun run lint` → Stop hook. Partially auto-fixable.
