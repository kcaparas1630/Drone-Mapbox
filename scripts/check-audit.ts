// Runs `bun audit --json` and fails only on high or critical advisories (security §5; Bun 1.2 has no level flag).
import { spawnSync } from 'node:child_process';

import { findSevereAdvisories } from './convention-checks/find-severe-advisories';
import { REPO_ROOT } from './convention-checks/repo-root';
import { reportCheckResult } from './convention-checks/report-check-result';

const audit = spawnSync('bun', ['audit', '--json'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
  shell: process.platform === 'win32',
  maxBuffer: 64 * 1024 * 1024,
});
const problems =
  audit.error === undefined ? findSevereAdvisories(audit.stdout.trim()) : [String(audit.error)];
reportCheckResult('check-audit', problems, 'no high or critical advisories');
