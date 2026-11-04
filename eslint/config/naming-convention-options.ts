// Option list for @typescript-eslint/naming-convention implementing the identifier rules of convention 001.
import type { Linter } from 'eslint';

const BOOLEAN_PREFIXES = ['is', 'has', 'can', 'should'];
const BOOLEAN_CONSTANT_PREFIXES = ['IS_', 'HAS_', 'CAN_', 'SHOULD_'];

export const namingConventionOptions: Linter.RuleEntry = [
  'error',
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'forbid',
    trailingUnderscore: 'forbid',
  },
  { selector: 'import', format: ['camelCase', 'PascalCase'] },
  { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
  {
    selector: 'variable',
    modifiers: ['const', 'global'],
    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
  },
  {
    selector: 'variable',
    modifiers: ['const', 'global'],
    types: ['string', 'number'],
    format: ['UPPER_CASE'],
  },
  {
    selector: ['variable', 'parameter'],
    types: ['boolean'],
    format: ['PascalCase', 'UPPER_CASE'],
    prefix: [...BOOLEAN_PREFIXES, ...BOOLEAN_CONSTANT_PREFIXES],
  },
  {
    selector: ['variable', 'parameter'],
    modifiers: ['destructured'],
    types: ['boolean'],
    format: ['camelCase', 'PascalCase'],
  },
  { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
  { selector: 'function', format: ['camelCase', 'PascalCase'] },
  { selector: 'typeLike', format: ['PascalCase'] },
  { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
  {
    selector: ['objectLiteralProperty', 'typeProperty', 'classProperty'],
    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
  },
  { selector: ['objectLiteralMethod', 'typeMethod', 'classMethod'], format: ['camelCase'] },
  {
    selector: ['objectLiteralProperty', 'typeProperty'],
    modifiers: ['requiresQuotes'],
    format: null,
  },
];
