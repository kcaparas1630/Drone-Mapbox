// Fails when a Mapbox token or a .env file is tracked or staged; `--staged` checks the index (security §2).
import { execFileSync } from 'node:child_process';

import type { SourceFile } from './convention-checks/convention-check.types';
import { findSecrets } from './convention-checks/find-secrets';
import { findRepoFiles } from './convention-checks/find-repo-files';
import { readSourceFiles } from './convention-checks/read-source-files';
import { REPO_ROOT } from './convention-checks/repo-root';
import { reportCheckResult } from './convention-checks/report-check-result';

// Runs git in the repo root and returns its stdout as text.
function runGit(args: string[]): string {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

// Returns the staged content of every added, copied, modified or renamed file.
function readStagedFiles(): SourceFile[] {
  const paths = runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
    .split('\n')
    .filter((path) => path !== '');
  return paths.map((path) => ({ path, content: runGit(['show', `:${path}`]) }));
}

const isStagedMode = process.argv.includes('--staged');
const files = isStagedMode ? readStagedFiles() : readSourceFiles(findRepoFiles());
reportCheckResult('check-no-secrets', findSecrets(files), `${String(files.length)} files clean`);
