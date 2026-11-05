// Counts lint and type-check suppressions repo-wide and fails above the budget of 10 (CLAUDE.md, 004).
import { DISABLE_MARKER_RULE } from './convention-checks/disable-marker-rule';
import { findRepoFiles } from './convention-checks/find-repo-files';
import { measureMarkedLines } from './convention-checks/measure-marked-lines';
import { readSourceFiles } from './convention-checks/read-source-files';
import { reportCheckResult } from './convention-checks/report-check-result';

const DISABLE_BUDGET = 10;
const SOURCE_FILE = /^((src|e2e|scripts|eslint)\/.+|[^/]+)\.(ts|tsx|js|mjs|cjs)$/;

// Counts the suppressions, adds a budget problem when over 10 and reports the result.
function runCountDisables(): void {
  const files = readSourceFiles(findRepoFiles().filter((path) => SOURCE_FILE.test(path)));
  const { count, problems } = measureMarkedLines(files, DISABLE_MARKER_RULE);
  if (count > DISABLE_BUDGET) {
    problems.push(`${String(count)} suppressions exceed the budget of ${String(DISABLE_BUDGET)}`);
  }
  reportCheckResult('count-eslint-disables', problems, `${String(count)}/10 suppressions`);
}

runCountDisables();
