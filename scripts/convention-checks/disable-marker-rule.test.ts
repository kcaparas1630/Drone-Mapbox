// Tests which suppression comments count, which need a reason and which are banned outright.
import { describe, expect, it } from 'vitest';

import { DISABLE_MARKER_RULE } from './disable-marker-rule';

const LINT_DISABLE = ['eslint', 'disable'].join('-');
const TS_IGNORE = ['@ts', 'ignore'].join('-');

describe('DISABLE_MARKER_RULE', () => {
  it('matches every lint-disable form and expect-error', () => {
    expect(DISABLE_MARKER_RULE.marker.test(`// ${LINT_DISABLE}-next-line no-console`)).toBe(true);
    expect(DISABLE_MARKER_RULE.marker.test(`// ${['@ts', 'expect', 'error'].join('-')} -- x`)).toBe(
      true,
    );
  });

  it('requires a reason after a double dash', () => {
    expect(DISABLE_MARKER_RULE.isWellFormed(`// ${LINT_DISABLE}-line x -- vendor API`)).toBe(true);
    expect(DISABLE_MARKER_RULE.isWellFormed(`// ${LINT_DISABLE}-line x`)).toBe(false);
  });

  it('ignores the marker words outside a line comment', () => {
    expect(DISABLE_MARKER_RULE.marker.test(`run('count-${LINT_DISABLE}s');`)).toBe(false);
  });

  it('always forbids ignore and nocheck directives', () => {
    expect(DISABLE_MARKER_RULE.isAlwaysForbidden?.(`// ${TS_IGNORE}`)).toBe(true);
    expect(DISABLE_MARKER_RULE.isAlwaysForbidden?.('const x = 1;')).toBe(false);
  });
});
