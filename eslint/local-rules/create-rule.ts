// Shared rule factory for the local plugin; every rule links to the convention table that lists it.
import { ESLintUtils } from '@typescript-eslint/utils';

const CONVENTION_RULE_TABLE_URL =
  'https://github.com/kcaparas1630/Drone-Mapbox/blob/main/docs/code-convention/012-agent-hooks-enforcement.md#local-eslint-rules-eslintlocal-rules';

export const createRule = ESLintUtils.RuleCreator(() => CONVENTION_RULE_TABLE_URL);
