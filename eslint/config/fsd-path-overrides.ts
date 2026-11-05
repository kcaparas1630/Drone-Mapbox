// Per-path rule overrides for src/: each override restates the complete option list so nothing is silently dropped.
import type { Linter } from 'eslint';

import { buildRestrictedImports } from './build-restricted-imports';
import { buildRestrictedSyntax } from './build-restricted-syntax';

const DEFAULT_SYNTAX = buildRestrictedSyntax({
  isStoreSubscribeAllowed: false,
  isMapboxMapConstructionAllowed: false,
  isTrigonometryAllowed: false,
  isDispatchBanned: false,
});

const DEFAULT_IMPORTS = buildRestrictedImports({
  isReactReduxHooksAllowed: false,
  isThreeAndMapboxAllowed: false,
  isMapboxCssAllowed: false,
  isReactBanned: false,
});

const STORAGE_GLOBALS_BANNED: Linter.RuleEntry = [
  'error',
  ...['localStorage', 'sessionStorage', 'indexedDB'].map((name) => ({
    name,
    message: 'Browser storage is accessed only through shared/lib/storage (convention 008).',
  })),
];

const BROWSER_GLOBALS_BANNED_IN_PURE_LOGIC: Linter.RuleEntry = [
  'error',
  ...['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'indexedDB'].map(
    (name) => ({
      name,
      message:
        'Pure entity logic must not touch browser globals; put the adapter in api/ (convention 003).',
    }),
  ),
];

const JSON_PARSE_BANNED: Linter.RuleEntry = [
  'error',
  {
    object: 'JSON',
    property: 'parse',
    message:
      'Parse JSON only in shared/api or shared/lib/storage, behind a zod schema (convention 008).',
  },
];

const PURE_ENTITY_IMPORTS = buildRestrictedImports({
  isReactReduxHooksAllowed: false,
  isThreeAndMapboxAllowed: false,
  isMapboxCssAllowed: false,
  isReactBanned: true,
});

const THREE_AND_MAPBOX_ALLOWED_IMPORTS = buildRestrictedImports({
  isReactReduxHooksAllowed: false,
  isThreeAndMapboxAllowed: true,
  isMapboxCssAllowed: false,
  isReactBanned: false,
});

export const fsdPathOverrides: Linter.Config[] = [
  {
    name: 'fireflybc/src-defaults',
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': DEFAULT_SYNTAX,
      '@typescript-eslint/no-restricted-imports': DEFAULT_IMPORTS,
      'no-restricted-globals': STORAGE_GLOBALS_BANNED,
      'no-restricted-properties': JSON_PARSE_BANNED,
      'no-console': 'error',
    },
  },
  {
    name: 'fireflybc/app-may-subscribe-and-import-mapbox-css',
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': buildRestrictedSyntax({
        isStoreSubscribeAllowed: true,
        isMapboxMapConstructionAllowed: false,
        isTrigonometryAllowed: false,
        isDispatchBanned: false,
      }),
      '@typescript-eslint/no-restricted-imports': buildRestrictedImports({
        isReactReduxHooksAllowed: false,
        isThreeAndMapboxAllowed: false,
        isMapboxCssAllowed: true,
        isReactBanned: false,
      }),
    },
  },
  {
    name: 'fireflybc/map-view-owns-mapbox-and-three',
    files: ['src/widgets/map-view/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': buildRestrictedSyntax({
        isStoreSubscribeAllowed: false,
        isMapboxMapConstructionAllowed: true,
        isTrigonometryAllowed: false,
        isDispatchBanned: false,
      }),
      '@typescript-eslint/no-restricted-imports': THREE_AND_MAPBOX_ALLOWED_IMPORTS,
    },
  },
  {
    name: 'fireflybc/entity-adapters-may-import-mapbox-and-three',
    files: ['src/entities/{drone,fire,terrain,map-camera}/api/**/*.{ts,tsx}'],
    rules: { '@typescript-eslint/no-restricted-imports': THREE_AND_MAPBOX_ALLOWED_IMPORTS },
  },
  {
    name: 'fireflybc/geo-maths-may-use-trigonometry-and-mapbox-types',
    files: ['src/shared/lib/geo/**/*.ts'],
    rules: {
      'no-restricted-syntax': buildRestrictedSyntax({
        isStoreSubscribeAllowed: false,
        isMapboxMapConstructionAllowed: false,
        isTrigonometryAllowed: true,
        isDispatchBanned: false,
      }),
      '@typescript-eslint/no-restricted-imports': THREE_AND_MAPBOX_ALLOWED_IMPORTS,
    },
  },
  {
    name: 'fireflybc/pure-entity-lib',
    files: ['src/entities/*/lib/**/*.ts'],
    rules: {
      'no-restricted-syntax': buildRestrictedSyntax({
        isStoreSubscribeAllowed: false,
        isMapboxMapConstructionAllowed: false,
        isTrigonometryAllowed: true,
        isDispatchBanned: false,
      }),
      '@typescript-eslint/no-restricted-imports': PURE_ENTITY_IMPORTS,
      'no-restricted-globals': BROWSER_GLOBALS_BANNED_IN_PURE_LOGIC,
    },
  },
  {
    name: 'fireflybc/pure-entity-model',
    files: ['src/entities/*/model/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': PURE_ENTITY_IMPORTS,
      'no-restricted-globals': BROWSER_GLOBALS_BANNED_IN_PURE_LOGIC,
    },
  },
  {
    name: 'fireflybc/entity-ui-is-presentational',
    files: ['src/entities/*/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': buildRestrictedSyntax({
        isStoreSubscribeAllowed: false,
        isMapboxMapConstructionAllowed: false,
        isTrigonometryAllowed: false,
        isDispatchBanned: true,
      }),
    },
  },
  {
    name: 'fireflybc/typed-redux-hooks-wrap-react-redux',
    files: ['src/shared/lib/redux/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': buildRestrictedImports({
        isReactReduxHooksAllowed: true,
        isThreeAndMapboxAllowed: false,
        isMapboxCssAllowed: false,
        isReactBanned: false,
      }),
    },
  },
  {
    name: 'fireflybc/storage-boundary',
    files: ['src/shared/lib/storage/**/*.ts'],
    rules: { 'no-restricted-globals': 'off', 'no-restricted-properties': 'off' },
  },
  {
    name: 'fireflybc/fetch-boundary',
    files: ['src/shared/api/**/*.ts'],
    rules: { 'no-restricted-properties': 'off' },
  },
  {
    name: 'fireflybc/report-error-may-use-console',
    files: ['src/shared/lib/report-error.ts'],
    rules: { 'no-console': ['error', { allow: ['warn', 'error'] }] },
  },
];
