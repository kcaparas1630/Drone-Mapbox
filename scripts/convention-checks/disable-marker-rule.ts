// Marker rule for lint and type-check suppressions: each needs a `-- reason`; ignore/nocheck are banned.
import type { MarkerRule } from './convention-check.types';

const LINT_DISABLE = ['eslint', 'disable'].join('-');
const TS_EXPECT_ERROR = ['@ts', 'expect', 'error'].join('-');
const BANNED_TS_DIRECTIVES = new RegExp(
  String.raw`//\s*@ts-(${['ign', 'ore|no', 'check'].join('')})`,
);

export const DISABLE_MARKER_RULE: MarkerRule = {
  marker: new RegExp(String.raw`//\s*(${LINT_DISABLE}|${TS_EXPECT_ERROR})`),
  isAlwaysForbidden: (line) => BANNED_TS_DIRECTIVES.test(line),
  isWellFormed: (line) => /\s--\s+\S/.test(line),
  fixHint:
    'every suppression needs `-- reason`; ts-ignore and ts-nocheck are banned (convention 004)',
};
