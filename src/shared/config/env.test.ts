// Tests environment validation: public tokens pass, missing or secret tokens fail with a clear message.
import { describe, expect, it } from 'vitest';

import { readEnv } from './env';

describe('readEnv', () => {
  it('returns the token when it is a public pk. token', () => {
    expect(readEnv({ VITE_MAPBOX_TOKEN: 'pk.abc' })).toEqual({
      isOk: true,
      value: { mapboxToken: 'pk.abc', isDevBuild: false },
    });
  });

  it('explains how to fix a missing token', () => {
    const result = readEnv({});
    expect(result.isOk ? '' : result.error).toContain('.env.local');
  });

  it('rejects a secret sk. token', () => {
    const result = readEnv({ VITE_MAPBOX_TOKEN: 'sk.secret' });
    expect(result.isOk ? '' : result.error).toContain('public "pk." token');
  });

  it('reports a development build so dev-only diagnostics can be enabled', () => {
    const result = readEnv({ VITE_MAPBOX_TOKEN: 'pk.abc', DEV: true });
    expect(result.isOk && result.value.isDevBuild).toBe(true);
  });
});
