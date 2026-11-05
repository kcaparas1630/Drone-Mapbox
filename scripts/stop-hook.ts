// Agent Stop hook: re-runs `bun run check` when checked files changed and blocks the stop on failure (012).
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { computeContentHash } from './agent-hooks/compute-content-hash';
import { selectCheckedFiles } from './agent-hooks/select-checked-files';
import { findRepoFiles } from './convention-checks/find-repo-files';
import { REPO_ROOT } from './convention-checks/repo-root';

const HASH_FILE = join(REPO_ROOT, '.claude', '.last-check-ok');
const ATTEMPTS_FILE = join(REPO_ROOT, '.claude', '.stop-hook-attempts');
const MAX_ATTEMPTS = 3;
const OUTPUT_TAIL_LINES = 150;

// Returns a small state file's trimmed text, or an empty string when it does not exist yet.
function readStateFile(path: string): string {
  try {
    return readFileSync(path, 'utf8').trim();
  } catch {
    return '';
  }
}

// Reads and discards the hook JSON on stdin; the hook only needs the repository state.
function readHookInput(): void {
  try {
    readFileSync(0, 'utf8');
  } catch (error) {
    console.error(`stop-hook: no hook input on stdin (${String(error)}); continuing`);
  }
}

// Runs `bun run check` and returns its exit status and the last lines of its combined output.
function runCheck(): { status: number; outputTail: string } {
  const result = spawnSync('bun', ['run', 'check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  const output = `${result.stdout}\n${result.stderr}`.split('\n');
  return { status: result.status ?? 1, outputTail: output.slice(-OUTPUT_TAIL_LINES).join('\n') };
}

// Decides the hook's exit code: 0 when clean or unchanged, 2 to block, 0 again after 3 failures.
function runStopHook(): number {
  readHookInput();
  const checkedFiles = selectCheckedFiles(findRepoFiles());
  const hash = computeContentHash(checkedFiles, (path) => readFileSync(join(REPO_ROOT, path)));
  if (readStateFile(HASH_FILE) === hash) {
    rmSync(ATTEMPTS_FILE, { force: true });
    return 0;
  }
  const { status, outputTail } = runCheck();
  if (status === 0) {
    writeFileSync(HASH_FILE, hash);
    rmSync(ATTEMPTS_FILE, { force: true });
    return 0;
  }
  const attempts = Number(readStateFile(ATTEMPTS_FILE) || '0') + 1;
  if (attempts >= MAX_ATTEMPTS) {
    rmSync(ATTEMPTS_FILE, { force: true });
    console.error(
      `${outputTail}\n\n!!! stop-hook: bun run check FAILED ${String(attempts)} times in a row.`,
    );
    console.error('!!! Letting the agent stop so a human can look. Fix the failures above.');
    return 0;
  }
  writeFileSync(ATTEMPTS_FILE, String(attempts));
  console.error(
    `${outputTail}\n\nstop-hook: bun run check failed (attempt ${String(attempts)}/3). Fix it.`,
  );
  return 2;
}

process.exit(runStopHook());
