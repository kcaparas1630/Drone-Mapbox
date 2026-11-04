// Local ESLint plugin holding the convention rules no published rule covers (conventions 001-013).
import type { TSESLint } from '@typescript-eslint/utils';

export const localRules = {
  meta: { name: 'local', version: '0.0.0' },
  rules: {},
} satisfies TSESLint.FlatConfig.Plugin;
