// Counts owned to-do notes in source folders and fails above the budget of 20 (convention 002).
import { findRepoFiles } from './convention-checks/find-repo-files';
import { measureMarkedLines } from './convention-checks/measure-marked-lines';
import { readSourceFiles } from './convention-checks/read-source-files';
import { reportCheckResult } from './convention-checks/report-check-result';
import { TODO_MARKER_RULE } from './convention-checks/todo-marker-rule';

const TODO_BUDGET = 20;
const SOURCE_FILE = /^(src|e2e|scripts|eslint)\/.+\.(ts|tsx|js|mjs)$/;

// Counts the notes, adds a budget problem when over 20 and reports the result.
function runCountTodos(): void {
  const files = readSourceFiles(findRepoFiles().filter((path) => SOURCE_FILE.test(path)));
  const { count, problems } = measureMarkedLines(files, TODO_MARKER_RULE);
  if (count > TODO_BUDGET) {
    problems.push(`${String(count)} to-do notes exceed the budget of ${String(TODO_BUDGET)}`);
  }
  reportCheckResult('count-todos', problems, `${String(count)}/${String(TODO_BUDGET)} owned notes`);
}

runCountTodos();
