// Tests detection of Mapbox tokens and env files, and that secrets are masked in the output.
import { describe, expect, it } from 'vitest';

import { findSecrets } from './find-secrets';

const FAKE_TOKEN = ['pk', 'eyJ1IjoiZmFrZXVzZXIiLCJhIjoiY2xmYWtlIn0', 'AbCdEfGhIjKlMnOp'].join('.');

describe('findSecrets', () => {
  it('reports a token with file, line and a masked prefix only', () => {
    const problems = findSecrets([
      { path: 'src/a.ts', content: `x\nconst token = '${FAKE_TOKEN}';` },
    ]);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('src/a.ts:2: public pk. Mapbox token (pk.eyJ');
    expect(problems[0]).not.toContain(FAKE_TOKEN);
  });

  it('ignores prose and the empty example value', () => {
    const problems = findSecrets([
      { path: '.env.example', content: 'VITE_MAPBOX_TOKEN=\n# a public pk. token' },
      { path: 'docs/a.md', content: 'Use a `pk.` token, never `sk.`.' },
    ]);
    expect(problems).toEqual([]);
  });

  it('reports env files other than the example', () => {
    expect(findSecrets([{ path: 'config/.env.local', content: '' }])).toEqual([
      'config/.env.local: .env files must never be committed; only .env.example is allowed',
    ]);
  });

  it('skips binary files', () => {
    expect(findSecrets([{ path: 'public/models/drone.glb', content: FAKE_TOKEN }])).toEqual([]);
  });
});
