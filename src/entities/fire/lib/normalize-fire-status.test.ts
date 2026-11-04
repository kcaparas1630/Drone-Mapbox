// Tests status mapping for known, oddly formatted, unknown and missing values.
import { describe, expect, it } from 'vitest';

import { normalizeFireStatus } from './normalize-fire-status';

describe('normalizeFireStatus', () => {
  it('keeps the BCWS statuses', () => {
    expect(normalizeFireStatus('Out of Control')).toBe('Out of Control');
    expect(normalizeFireStatus('Fire of Note')).toBe('Fire of Note');
  });

  it('tolerates case and extra spaces', () => {
    expect(normalizeFireStatus('  being   held ')).toBe('Being Held');
  });

  it('maps unknown and missing statuses to Unknown', () => {
    expect(normalizeFireStatus('Smouldering')).toBe('Unknown');
    expect(normalizeFireStatus(null)).toBe('Unknown');
  });
});
