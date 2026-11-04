// Tests that reportError routes warnings and errors to the right console method with context.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { reportError } from './report-error';

describe('reportError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs errors with the context and the original error object', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const problem = new Error('feed down');
    reportError(problem, 'fire feed');
    expect(consoleError).toHaveBeenCalledWith('[FireflyBC] fire feed: feed down', problem);
  });

  it('logs warnings with console.warn and stringifies non-errors', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    reportError('3 fires dropped', 'normalise', 'warn');
    expect(consoleWarn).toHaveBeenCalledWith('[FireflyBC] normalise: 3 fires dropped');
  });
});
