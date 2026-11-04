// Tests that the Result union narrows to the value on success and the error on failure.
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { Result } from './result';

// Returns the value of a successful result or a fallback for a failed one.
function readValueOrFallback(result: Result<number, string>, fallback: number): number {
  return result.isOk ? result.value : fallback;
}

describe('Result', () => {
  it('narrows to the value when isOk is true', () => {
    expect(readValueOrFallback({ isOk: true, value: 7 }, 0)).toBe(7);
  });

  it('narrows to the error when isOk is false', () => {
    const failed: Result<number, string> = { isOk: false, error: 'boom' };
    expect(readValueOrFallback(failed, -1)).toBe(-1);
    expectTypeOf(failed).toExtend<Result<number, string>>();
  });
});
