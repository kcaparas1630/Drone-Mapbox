// Tests the one-line purpose comment format: capital letter, final period, 120-character limit.
import { describe, expect, it } from 'vitest';

import { validateCommentText } from './validate-comment-text';

describe('validateCommentText', () => {
  it('accepts a capitalised sentence ending with a period', () => {
    expect(validateCommentText(' Loads the drone GLB and returns its scene group.')).toBeNull();
  });

  it('rejects an empty comment', () => {
    expect(validateCommentText('   ')).toBe('emptyComment');
  });

  it('rejects a lower-case start', () => {
    expect(validateCommentText(' loads the drone.')).toBe('notCapitalized');
  });

  it('rejects a missing final period', () => {
    expect(validateCommentText(' Loads the drone')).toBe('missingPeriod');
  });

  it('rejects text longer than 120 characters', () => {
    expect(validateCommentText(` A${'a'.repeat(119)}.`)).toBe('tooLong');
  });
});
