// Tests hectare formatting.
import { describe, expect, it } from 'vitest';

import { formatFireSize } from './format-fire-size';

describe('formatFireSize', () => {
  it('adds separators and keeps at most one decimal', () => {
    expect(formatFireSize(13_970)).toBe('13,970 ha');
    expect(formatFireSize(0.46)).toBe('0.5 ha');
  });

  it('says when the size is unknown', () => {
    expect(formatFireSize(null)).toBe('Not reported');
  });
});
