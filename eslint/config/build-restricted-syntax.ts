// Builds the full no-restricted-syntax option list for one path group, so a path override never drops a selector.
import type { Linter } from 'eslint';

export type RestrictedSyntaxOptions = {
  isStoreSubscribeAllowed: boolean;
  isMapboxMapConstructionAllowed: boolean;
  isTrigonometryAllowed: boolean;
  isDispatchBanned: boolean;
};

type SyntaxRestriction = { selector: string; message: string };

const COMPONENT_ARROW_SELECTOR =
  'VariableDeclarator[id.name=/^[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*$/] > :matches(ArrowFunctionExpression, FunctionExpression)';

const ALWAYS_BANNED: SyntaxRestriction[] = [
  {
    selector: 'TSEnumDeclaration',
    message: 'Enums are banned; use an `as const` object plus a union type (convention 004).',
  },
  {
    selector: 'CallExpression[callee.name=/^(createStore|legacy_createStore)$/]',
    message:
      'Hand-built stores are banned; assemble the store with configureStore (convention 005).',
  },
  {
    selector: COMPONENT_ARROW_SELECTOR,
    message: 'Declare components as `export function Name(props: NameProps)` (convention 006).',
  },
  {
    selector: "JSXAttribute[name.name='style']",
    message: 'Inline style props are banned; use Tailwind classes (convention 009).',
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: 'dangerouslySetInnerHTML is banned anywhere (convention 006, security).',
  },
];

const STORE_SUBSCRIBE_BANNED: SyntaxRestriction[] = [
  {
    selector: "CallExpression[callee.property.name='subscribe'][callee.object.name=/[sS]tore$/]",
    message:
      'Only src/app may call store.subscribe; the loop reads getState() instead (convention 005).',
  },
  {
    selector:
      "CallExpression[callee.property.name='subscribe'][callee.object.property.name=/[sS]tore$/]",
    message:
      'Only src/app may call store.subscribe; the loop reads getState() instead (convention 005).',
  },
];

const MAPBOX_MAP_CONSTRUCTION_BANNED: SyntaxRestriction[] = [
  {
    selector: "NewExpression[callee.object.name=/^mapbox/i][callee.property.name='Map']",
    message: 'Only widgets/map-view creates the Mapbox map (convention 007).',
  },
  {
    selector:
      "ImportDeclaration[source.value='mapbox-gl'][importKind='value'] > ImportSpecifier[importKind='value'][imported.name='Map']",
    message:
      'Only widgets/map-view creates the Mapbox map; import `Map` as a type here (convention 007).',
  },
];

const TRIGONOMETRY_BANNED: SyntaxRestriction[] = [
  {
    selector:
      "CallExpression[callee.object.name='Math'][callee.property.name=/^(sin|cos|tan|asin|acos|atan|atan2)$/]",
    message: 'Trigonometry lives in shared/lib/geo or entities/*/lib only (convention 007).',
  },
];

const DISPATCH_BANNED: SyntaxRestriction[] = [
  {
    selector:
      ":matches(CallExpression[callee.name='dispatch'], CallExpression[callee.property.name='dispatch'])",
    message:
      'Components under entities/*/ui are presentational and never dispatch (convention 006).',
  },
];

// Returns the rule entry with every selector that applies to the given path group.
export function buildRestrictedSyntax(options: RestrictedSyntaxOptions): Linter.RuleEntry {
  return [
    'error',
    ...ALWAYS_BANNED,
    ...(options.isStoreSubscribeAllowed ? [] : STORE_SUBSCRIBE_BANNED),
    ...(options.isMapboxMapConstructionAllowed ? [] : MAPBOX_MAP_CONSTRUCTION_BANNED),
    ...(options.isTrigonometryAllowed ? [] : TRIGONOMETRY_BANNED),
    ...(options.isDispatchBanned ? DISPATCH_BANNED : []),
  ];
}
