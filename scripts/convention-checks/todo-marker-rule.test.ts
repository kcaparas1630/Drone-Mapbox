// Tests which to-do notes count and which are malformed.
import { describe, expect, it } from 'vitest';

import { TODO_MARKER_RULE } from './todo-marker-rule';

const WORD = ['TO', 'DO'].join('');

describe('TODO_MARKER_RULE', () => {
  it('matches the marker as a whole word only', () => {
    expect(TODO_MARKER_RULE.marker.test(`// ${WORD}(kent): tune it.`)).toBe(true);
    expect(TODO_MARKER_RULE.marker.test('const todoList = 1;')).toBe(false);
  });

  it('accepts an owned note with text and rejects a bare one', () => {
    expect(TODO_MARKER_RULE.isWellFormed(`// ${WORD}(kent): tune lookahead.`)).toBe(true);
    expect(TODO_MARKER_RULE.isWellFormed(`// ${WORD}: tune lookahead.`)).toBe(false);
    expect(TODO_MARKER_RULE.isWellFormed(`// ${WORD}(kent):`)).toBe(false);
  });
});
