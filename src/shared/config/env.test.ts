// Tests environment validation: public tokens pass, missing or secret tokens fail with a clear message.
import { describe, expect, it } from 'vitest';

import { readEnv } from './env';

describe('readEnv', () => {
  it('returns the token when it is a public pk. token', () => {
    expect(readEnv({ VITE_MAPBOX_TOKEN: 'pk.abc' })).toEqual({
      isOk: true,
      value: { mapboxToken: 'pk.abc' },
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
});
