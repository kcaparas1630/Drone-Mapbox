// ESLint flat config: type-aware TypeScript, React, FSD boundaries and the convention rules in docs/code-convention.
import { fileURLToPath } from 'node:url';

import eslintJs from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';
import importX from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { fsdBoundaries } from './eslint/config/fsd-boundaries';
import { fsdPathOverrides } from './eslint/config/fsd-path-overrides';
import { namingConventionOptions } from './eslint/config/naming-convention-options';
import { schemaNamingConventionOptions } from './eslint/config/schema-naming-convention-options';
import { localRules } from './eslint/local-rules/local-rules';

const REPO_ROOT = fileURLToPath(new URL('.', import.meta.url));

const TS_FILES = ['**/*.{ts,tsx}'];
const BROWSER_FILES = ['src/**/*.{ts,tsx}'];
const NODE_FILES = [
  '*.config.{ts,js}',
  'eslint/**/*.ts',
  'scripts/**/*.ts',
  'e2e/**/*.ts',
  'vitest.setup.ts',
];
const TEST_FILES = ['**/*.test.{ts,tsx}'];
const DEFAULT_EXPORT_FILES = ['*.config.{ts,js}', 'src/pages/**/*.{ts,tsx}'];

export default defineConfig([
  globalIgnores([
    'dist/**',
    'dev-dist/**',
    'coverage/**',
    'node_modules/**',
    '.claude/**',
    'playwright-report/**',
    'test-results/**',
    'public/**',
  ]),
  {
    name: 'fireflybc/typescript',
    files: TS_FILES,
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    plugins: { boundaries, 'import-x': importX, local: localRules, unicorn },
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: REPO_ROOT },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description', minimumDescriptionLength: 10 },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/naming-convention': namingConventionOptions,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            FC: { message: 'Declare components as plain functions (convention 006).' },
            'React.FC': { message: 'Declare components as plain functions (convention 006).' },
            FunctionComponent: {
              message: 'Declare components as plain functions (convention 006).',
            },
            'React.FunctionComponent': {
              message: 'Declare components as plain functions (convention 006).',
            },
          },
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: false, requireDefaultForNonUnion: true },
      ],
      'id-length': [
        'error',
        {
          min: 3,
          exceptions: ['i', 'j', 'k', 'x', 'y', 'z', 'dt', 't', 'cn'],
          properties: 'never',
        },
      ],
      'import-x/no-default-export': 'error',
      'local/file-purpose-comment': 'error',
      'local/function-name-starts-with-verb': ['error', { allowedNames: ['cn', 'prerender'] }],
      'local/no-css-file-outside-app': 'error',
      'local/no-vague-filename': 'error',
      'local/no-vague-identifier': 'error',
      'local/one-line-function-comment': 'error',
      'local/one-value-export-per-file': 'error',
      'local/related-type-exports-only': 'error',
      'max-classes-per-file': ['error', 1],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      'no-console': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-restricted-imports': 'off',
      'no-warning-comments': ['error', { terms: ['fixme', 'hack', 'xxx'], location: 'anywhere' }],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  {
    name: 'fireflybc/react',
    files: BROWSER_FILES,
    extends: [
      reactHooks.configs.flat.recommended,
      eslintReact.configs['recommended-type-checked'],
      eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'],
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'error',
      '@eslint-react/no-class-component': 'error',
      'local/fetch-through-shared-api': 'error',
      'local/no-alloc-in-render-loop': 'error',
      'local/redux-action-past-tense': 'error',
      'local/require-dispose-in-on-remove': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  fsdBoundaries,
  ...fsdPathOverrides,
  {
    name: 'fireflybc/node-side',
    files: NODE_FILES,
    languageOptions: { globals: globals.node },
  },
  {
    name: 'fireflybc/schemas-and-configs-mirror-external-keys',
    files: ['src/**/*.schema.ts', '*.config.ts'],
    rules: { '@typescript-eslint/naming-convention': schemaNamingConventionOptions },
  },
  {
    name: 'fireflybc/scripts-may-print',
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    name: 'fireflybc/default-exports-where-the-tool-requires-them',
    files: DEFAULT_EXPORT_FILES,
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    name: 'fireflybc/tests',
    files: TEST_FILES,
    extends: [vitest.configs.recommended],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-lines-per-function': 'off',
      'vitest/expect-expect': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
    },
  },
  {
    name: 'fireflybc/plain-javascript',
    files: ['**/*.{js,mjs,cjs}'],
    extends: [eslintJs.configs.recommended, tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
]);
