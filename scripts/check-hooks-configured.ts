// Fails unless the agent hooks, every local rule of convention 012 and the full check script are wired up.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { findHookConfigProblems } from './convention-checks/find-hook-config-problems';
import { REPO_ROOT } from './convention-checks/repo-root';
import { reportCheckResult } from './convention-checks/report-check-result';

const ESLINT_CONFIG_DIRECTORY = 'eslint/config';

// Returns a repo file's text, or an empty string (with a printed reason) when it cannot be read.
function readRepoFile(path: string): string {
  try {
    return readFileSync(join(REPO_ROOT, path), 'utf8');
  } catch (error) {
    console.error(`check-hooks-configured: cannot read ${path} (${String(error)})`);
    return '';
  }
}

// Gathers the settings, docs, registry and config sources and reports every wiring problem.
function runCheckHooksConfigured(): void {
  const configFiles = readdirSync(join(REPO_ROOT, ESLINT_CONFIG_DIRECTORY));
  const problems = findHookConfigProblems({
    settingsJson: readRepoFile('.claude/settings.json'),
    conventionDoc: readRepoFile('docs/code-convention/012-agent-hooks-enforcement.md'),
    localRuleFiles: readdirSync(join(REPO_ROOT, 'eslint/local-rules')),
    registrySource: readRepoFile('eslint/local-rules/local-rules.ts'),
    eslintConfigSource: [
      readRepoFile('eslint.config.ts'),
      ...configFiles.map((name) => readRepoFile(`${ESLINT_CONFIG_DIRECTORY}/${name}`)),
    ].join('\n'),
    packageJson: readRepoFile('package.json'),
  });
  reportCheckResult('check-hooks-configured', problems, 'hooks, local rules and check are wired');
}

runCheckHooksConfigured();
