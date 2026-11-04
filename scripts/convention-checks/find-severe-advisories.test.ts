// Tests that only high and critical advisories fail the audit gate.
import { describe, expect, it } from 'vitest';

import { findSevereAdvisories } from './find-severe-advisories';

describe('findSevereAdvisories', () => {
  it('ignores low and moderate advisories and an empty report', () => {
    const report = { glob: [{ severity: 'moderate', title: 'DoS', url: 'https://x' }] };
    expect(findSevereAdvisories(JSON.stringify(report))).toEqual([]);
    expect(findSevereAdvisories('')).toEqual([]);
  });

  it('reports high and critical advisories with package and link', () => {
    const report = {
      lodash: [
        { severity: 'critical', title: 'Prototype pollution', url: 'https://a' },
        { severity: 'low', title: 'Minor', url: 'https://b' },
      ],
    };
    expect(findSevereAdvisories(JSON.stringify(report))).toEqual([
      'critical: lodash — Prototype pollution (https://a)',
    ]);
  });

  it('reports unparseable or unexpected output instead of passing silently', () => {
    expect(findSevereAdvisories('not json')[0]).toContain('not JSON');
    expect(findSevereAdvisories('{"x": 1}')[0]).toContain('unexpected shape');
  });
});
