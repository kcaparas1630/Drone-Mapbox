// Tests verification of agent hooks, the local-rule table, the plugin registry and the check script.
import { describe, expect, it } from 'vitest';

import type { HookConfigSources } from './convention-check.types';
import { findHookConfigProblems } from './find-hook-config-problems';

const SETTINGS = JSON.stringify({
  hooks: {
    Stop: [{ hooks: [{ type: 'command', command: 'bun scripts/stop-hook.ts', timeout: 600 }] }],
    PostToolUse: [
      {
        matcher: 'Edit|Write',
        hooks: [{ type: 'command', command: 'bun scripts/format-touched-file.ts', timeout: 60 }],
      },
    ],
  },
});

const VALID_SOURCES: HookConfigSources = {
  settingsJson: SETTINGS,
  conventionDoc: '| Rule | Convention |\n|---|---|\n| `fake-rule` | 001 |\n',
  localRuleFiles: ['fake-rule.ts', 'fake-rule.test.ts'],
  registrySource: "'fake-rule': fakeRule,",
  eslintConfigSource: "'local/fake-rule': 'error',",
  packageJson: JSON.stringify({
    scripts: {
      check:
        'bun run typecheck && bun run lint && bun run format:check && bun run test && bun run check:scripts',
    },
  }),
};

describe('findHookConfigProblems', () => {
  it('passes a complete configuration', () => {
    expect(findHookConfigProblems(VALID_SOURCES)).toEqual([]);
  });

  it('reports missing hooks and invalid settings JSON', () => {
    expect(findHookConfigProblems({ ...VALID_SOURCES, settingsJson: '{}' })).toHaveLength(2);
    expect(findHookConfigProblems({ ...VALID_SOURCES, settingsJson: '{' })[0]).toContain(
      'not valid JSON',
    );
  });

  it('reports a listed rule that has no file, test, registration or config entry', () => {
    const problems = findHookConfigProblems({
      ...VALID_SOURCES,
      localRuleFiles: [],
      registrySource: '',
      eslintConfigSource: '',
    });
    expect(problems).toEqual([
      'eslint/local-rules/fake-rule.ts is missing (listed in convention 012)',
      'eslint/local-rules/fake-rule.test.ts is missing (listed in convention 012)',
      "eslint/local-rules/local-rules.ts does not register 'fake-rule'",
      "eslint config does not enable 'local/fake-rule'",
    ]);
  });

  it('reports an empty rule table and an incomplete check script', () => {
    const problems = findHookConfigProblems({
      ...VALID_SOURCES,
      conventionDoc: '',
      packageJson: JSON.stringify({ scripts: { check: 'bun run lint' } }),
    });
    expect(problems).toContain('docs/code-convention/012: no local rules found in the rule table');
    expect(problems).toContain('package.json: the check script must run typecheck');
  });
});
