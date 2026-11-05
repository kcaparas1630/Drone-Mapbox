// Tests the search limit message for each spent window.
import { describe, expect, it } from 'vitest';

import { readSearchLimitMessage } from './read-search-limit-message';

describe('readSearchLimitMessage', () => {
  it('asks the user to wait a minute when the minute window is spent', () => {
    expect(readSearchLimitMessage('minute')).toBe('Search limit reached — try again in a minute.');
  });

  it('points to recent places when the daily cap is spent', () => {
    expect(readSearchLimitMessage('day')).toMatch(/for today on this device\. Recent places/);
  });
});
