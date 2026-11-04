// Fails when a pure module in entities lib/model or shared/lib lacks a sibling test (conventions 010, 013).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { findMissingSiblingTests } from './convention-checks/find-missing-sibling-tests';
import { findRepoFiles } from './convention-checks/find-repo-files';
import { REPO_ROOT } from './convention-checks/repo-root';
import { reportCheckResult } from './convention-checks/report-check-result';

const problems = findMissingSiblingTests(findRepoFiles(), (path) =>
  readFileSync(join(REPO_ROOT, path), 'utf8'),
);
reportCheckResult('check-tests-exist', problems, 'every pure module has a sibling test');
