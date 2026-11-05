// Tests conditional class joining and Tailwind conflict resolution.
import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('drops falsy values and lets later utilities win', () => {
    expect(cn('px-2 text-sm', [false, null, undefined], 'px-4')).toBe('text-sm px-4');
  });
});
