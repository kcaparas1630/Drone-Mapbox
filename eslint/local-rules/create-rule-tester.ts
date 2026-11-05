// Creates a RuleTester for the local rules, wired to Vitest's describe, it and afterAll hooks.
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

// Returns a RuleTester that parses TypeScript with JSX enabled, like the repo's ESLint config.
export function createRuleTester(): RuleTester {
  return new RuleTester({
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  });
}
