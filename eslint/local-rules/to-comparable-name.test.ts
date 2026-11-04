// Tests that naming styles collapse to one comparable form.
import { describe, expect, it } from 'vitest';

import { toComparableName } from './to-comparable-name';

describe('toComparableName', () => {
  it('collapses kebab, camel, Pascal, UPPER_SNAKE and dotted names', () => {
    expect(toComparableName('bc-bounding-box')).toBe('bcboundingbox');
    expect(toComparableName('BC_BOUNDING_BOX')).toBe('bcboundingbox');
    expect(toComparableName('fireSchema')).toBe('fireschema');
    expect(toComparableName('fire.schema')).toBe('fireschema');
  });
});
