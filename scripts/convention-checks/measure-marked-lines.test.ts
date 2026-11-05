// Tests counting of marker comments and reporting of malformed or forbidden ones.
import { describe, expect, it } from 'vitest';

import type { MarkerRule } from './convention-check.types';
import { measureMarkedLines } from './measure-marked-lines';

const OWNED_NOTE_RULE: MarkerRule = {
  marker: /\/\/.*\bNOTE\b/,
  isAlwaysForbidden: (line) => line.includes('BANNED'),
  isWellFormed: (line) => /NOTE\([^)\s]+\):/.test(line),
  fixHint: 'write NOTE(owner): text',
};

describe('measureMarkedLines', () => {
  it('counts well-formed markers without problems', () => {
    const result = measureMarkedLines(
      [{ path: 'a.ts', content: 'x();\n// NOTE(kent): keep this.\n' }],
      OWNED_NOTE_RULE,
    );
    expect(result).toEqual({ count: 1, problems: [] });
  });

  it('reports malformed markers with file and line', () => {
    const result = measureMarkedLines(
      [{ path: 'b.ts', content: 'x();\n\n// NOTE keep this.' }],
      OWNED_NOTE_RULE,
    );
    expect(result).toEqual({ count: 1, problems: ['b.ts:3: write NOTE(owner): text'] });
  });

  it('always reports forbidden lines even without the marker', () => {
    const result = measureMarkedLines(
      [{ path: 'c.ts', content: '// BANNED thing' }],
      OWNED_NOTE_RULE,
    );
    expect(result.problems).toEqual(['c.ts:1: write NOTE(owner): text']);
  });
});
