// Builds the full @typescript-eslint/no-restricted-imports option list for one path group.
import type { Linter } from 'eslint';

export type RestrictedImportsOptions = {
  isReactReduxHooksAllowed: boolean;
  isThreeAndMapboxAllowed: boolean;
  isMapboxCssAllowed: boolean;
  isReactBanned: boolean;
};

type PathRestriction = {
  name: string;
  message: string;
  importNames?: string[];
  allowTypeImports?: boolean;
};

type PatternRestriction = { message: string } & ({ group: string[] } | { regex: string });

const ALWAYS_BANNED_PATHS: PathRestriction[] = [
  {
    name: 'redux',
    message: 'Import from @reduxjs/toolkit, never the redux core package (convention 005).',
  },
  {
    name: 'styled-components',
    message: 'CSS-in-JS is banned; use Tailwind classes (convention 009).',
  },
];

const ALWAYS_BANNED_PATTERNS: PatternRestriction[] = [
  { group: ['@emotion/*'], message: 'CSS-in-JS is banned; use Tailwind classes (convention 009).' },
  {
    group: ['*.module.css'],
    message: 'CSS modules are banned; use Tailwind classes (convention 009).',
  },
];

const REACT_REDUX_HOOKS_BANNED: PathRestriction = {
  name: 'react-redux',
  importNames: ['useSelector', 'useDispatch', 'useStore'],
  message:
    'Use useAppSelector / useAppDispatch / useAppStore from @/shared/lib/redux (convention 005).',
};

const THREE_AND_MAPBOX_MESSAGE =
  'three and mapbox-gl are allowed only in widgets/map-view, entities/*/api and shared/lib/geo (convention 007).';

const THREE_AND_MAPBOX_BANNED_PATHS: PathRestriction[] = [
  { name: 'three', message: THREE_AND_MAPBOX_MESSAGE },
  { name: 'mapbox-gl', message: THREE_AND_MAPBOX_MESSAGE },
];

const REACT_BANNED_PATHS: PathRestriction[] = [
  { name: 'react', message: 'Pure entity logic must not import React (convention 003).' },
  { name: 'react-dom', message: 'Pure entity logic must not import React DOM (convention 003).' },
];

const REACT_BANNED_PATTERNS: PatternRestriction[] = [
  {
    group: ['react/**', 'react-dom/**'],
    message: 'Pure entity logic must not import React (convention 003).',
  },
];

// Returns the three/mapbox-gl subpath ban as a regex (groups cannot re-include the allowed Mapbox stylesheet).
function buildThreeAndMapboxPatterns(isMapboxCssAllowed: boolean): PatternRestriction[] {
  const regex = isMapboxCssAllowed
    ? String.raw`^three/|^mapbox-gl/(?!dist/mapbox-gl\.css$)`
    : '^(three|mapbox-gl)/';
  return [{ regex, message: THREE_AND_MAPBOX_MESSAGE }];
}

// Returns the rule entry with every path and pattern ban that applies to the given path group.
export function buildRestrictedImports(options: RestrictedImportsOptions): Linter.RuleEntry {
  return [
    'error',
    {
      paths: [
        ...ALWAYS_BANNED_PATHS,
        ...(options.isReactReduxHooksAllowed ? [] : [REACT_REDUX_HOOKS_BANNED]),
        ...(options.isThreeAndMapboxAllowed ? [] : THREE_AND_MAPBOX_BANNED_PATHS),
        ...(options.isReactBanned ? REACT_BANNED_PATHS : []),
      ],
      patterns: [
        ...ALWAYS_BANNED_PATTERNS,
        ...(options.isThreeAndMapboxAllowed
          ? []
          : buildThreeAndMapboxPatterns(options.isMapboxCssAllowed)),
        ...(options.isReactBanned ? REACT_BANNED_PATTERNS : []),
      ],
    },
  ];
}
