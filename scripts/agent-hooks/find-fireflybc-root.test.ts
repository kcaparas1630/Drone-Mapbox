// Tests locating the FireflyBC root for files in the main tree, in worktrees and elsewhere.
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { findFireflybcRoot } from './find-fireflybc-root';

const MAIN = join('/repo');
const WORKTREE = join('/repo', '.claude', 'worktrees', 'agent-1');

// Reports package names for the main tree and a nested worktree only.
function readPackageName(directory: string): string | null {
  return directory === MAIN || directory === WORKTREE ? 'fireflybc' : null;
}

describe('findFireflybcRoot', () => {
  it('returns the main tree for its own files', () => {
    expect(findFireflybcRoot(join(MAIN, 'src', 'a.ts'), readPackageName)).toBe(MAIN);
  });

  it('returns the innermost worktree for files inside it', () => {
    expect(findFireflybcRoot(join(WORKTREE, 'src', 'a.ts'), readPackageName)).toBe(WORKTREE);
  });

  it('returns null outside any FireflyBC checkout', () => {
    expect(findFireflybcRoot(join('/elsewhere', 'a.ts'), readPackageName)).toBeNull();
  });
});
