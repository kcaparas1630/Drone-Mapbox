// ESLint settings and rules enforcing the Feature-Sliced Design layers, slices and entry points (convention 003).
import type { Linter } from 'eslint';

const LAYER_MAY_IMPORT: Record<string, string[]> = {
  app: ['pages', 'widgets', 'features', 'entities', 'shared'],
  pages: ['widgets', 'features', 'entities', 'shared'],
  widgets: ['features', 'entities', 'shared'],
  features: ['entities', 'shared'],
  entities: ['shared'],
  shared: ['shared'],
};

const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities'];

const LAYER_POLICIES = Object.entries(LAYER_MAY_IMPORT).map(([layer, targets]) => ({
  from: { element: { type: layer } },
  allow: { to: { element: { types: targets } } },
}));

const ENTRY_POINT_POLICY = {
  disallow: { to: { element: { types: SLICED_LAYERS, fileInternalPath: '!index.ts' } } },
  message:
    'Deep import into {{ to.element.type }}/{{ to.element.captured.slice }}: import the slice through its index.ts only (convention 003).',
};

export const fsdBoundaries: Linter.Config = {
  files: ['src/**/*.{ts,tsx}'],
  settings: {
    'boundaries/include': ['src/**/*'],
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app', partialMatch: false },
      { type: 'pages', pattern: 'src/pages/*', capture: ['slice'], partialMatch: false },
      { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'], partialMatch: false },
      { type: 'features', pattern: 'src/features/*', capture: ['slice'], partialMatch: false },
      { type: 'entities', pattern: 'src/entities/*', capture: ['slice'], partialMatch: false },
      { type: 'shared', pattern: 'src/shared/*', capture: ['segment'], partialMatch: false },
    ],
    'import/resolver': {
      typescript: { project: ['tsconfig.app.json'] },
    },
  },
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message:
          'A {{ from.element.type }} module may not import from {{ to.element.type }}/{{ to.element.captured.slice }} (convention 003 layer table).',
        policies: [...LAYER_POLICIES, ENTRY_POINT_POLICY],
      },
    ],
    'boundaries/no-unknown-files': 'error',
  },
};
