// Lists tracked and untracked-but-not-ignored files of the repository as forward-slash relative paths.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT } from './repo-root';

// Returns every existing file git considers part of the working tree, honouring .gitignore.
export function findRepoFiles(): string[] {
  const output = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && existsSync(join(REPO_ROOT, line)));
}
