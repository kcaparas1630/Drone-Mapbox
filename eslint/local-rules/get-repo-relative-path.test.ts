// Tests that ESLint filenames become repo-relative forward-slash paths on every platform.
import { describe, expect, it } from 'vitest';

import { getRepoRelativePath } from './get-repo-relative-path';

describe('getRepoRelativePath', () => {
  it('strips a Windows cwd prefix regardless of drive-letter case', () => {
    expect(getRepoRelativePath('C:\\repo\\src\\app\\main.tsx', 'c:\\repo')).toBe(
      'src/app/main.tsx',
    );
  });

  it('strips a POSIX cwd prefix with a trailing slash', () => {
    expect(getRepoRelativePath('/home/ci/repo/eslint/x.ts', '/home/ci/repo/')).toBe('eslint/x.ts');
  });

  it('returns relative input unchanged apart from a leading dot segment', () => {
    expect(getRepoRelativePath('./src/shared/lib/a.ts', '/elsewhere')).toBe('src/shared/lib/a.ts');
  });

  it('does not strip a cwd that is only a name prefix of another folder', () => {
    expect(getRepoRelativePath('/repo-two/src/a.ts', '/repo')).toBe('/repo-two/src/a.ts');
  });
});
