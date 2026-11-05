// Naming options for *.schema.ts: like the default, but object keys may be snake_case to mirror external payloads.
import type { Linter } from 'eslint';

import { namingConventionOptions } from './naming-convention-options';

const [severity, ...selectors] = namingConventionOptions as [
  Linter.RuleSeverity,
  ...Record<string, unknown>[],
];

export const schemaNamingConventionOptions: Linter.RuleEntry = [
  severity,
  ...selectors.map((selector) =>
    Array.isArray(selector.selector) &&
    selector.selector.includes('objectLiteralProperty') &&
    selector.modifiers === undefined
      ? { ...selector, format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] }
      : selector,
  ),
];
