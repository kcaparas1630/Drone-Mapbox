// Verifies the agent hooks, the local-rule set and the check script described by convention 012.
import type { HookConfigSources } from './convention-check.types';

type HookCommand = { type?: string; command?: string; timeout?: number };
type HookEntry = { matcher?: string; hooks?: HookCommand[] };
type ClaudeSettings = { hooks?: Record<string, HookEntry[] | undefined> };

const LOCAL_RULE_ROW = /^\| `([a-z-]+)` \| \d{3} \|$/gm;
const REQUIRED_CHECK_STEPS = ['typecheck', 'lint', 'format:check', 'bun run test', 'check:scripts'];

// Returns true when the event has a hook entry with this matcher, command and timeout.
function hasHook(
  settings: ClaudeSettings,
  event: string,
  matcher: string | undefined,
  command: string,
  timeout: number,
): boolean {
  return (settings.hooks?.[event] ?? []).some(
    (entry) =>
      entry.matcher === matcher &&
      (entry.hooks ?? []).some(
        (hook) => hook.type === 'command' && hook.command === command && hook.timeout === timeout,
      ),
  );
}

// Returns problems with .claude/settings.json hooks.
function findSettingsProblems(settingsJson: string): string[] {
  let settings: ClaudeSettings;
  try {
    settings = JSON.parse(settingsJson) as ClaudeSettings;
  } catch (error) {
    return [`.claude/settings.json is not valid JSON: ${String(error)}`];
  }
  const problems: string[] = [];
  if (!hasHook(settings, 'Stop', undefined, 'bun scripts/stop-hook.ts', 600)) {
    problems.push(
      '.claude/settings.json: missing Stop hook `bun scripts/stop-hook.ts` (timeout 600)',
    );
  }
  if (!hasHook(settings, 'PostToolUse', 'Edit|Write', 'bun scripts/format-touched-file.ts', 60)) {
    problems.push(
      '.claude/settings.json: missing PostToolUse Edit|Write hook `bun scripts/format-touched-file.ts` (timeout 60)',
    );
  }
  return problems;
}

// Returns every problem found across settings, the local-rule table, the plugin registry and package.json.
export function findHookConfigProblems(sources: HookConfigSources): string[] {
  const problems = findSettingsProblems(sources.settingsJson);
  const rules = [...sources.conventionDoc.matchAll(LOCAL_RULE_ROW)].map((match) => match[1] ?? '');
  if (rules.length === 0) {
    problems.push('docs/code-convention/012: no local rules found in the rule table');
  }
  const ruleFiles = new Set(sources.localRuleFiles);
  for (const rule of rules) {
    for (const file of [`${rule}.ts`, `${rule}.test.ts`]) {
      if (!ruleFiles.has(file)) {
        problems.push(`eslint/local-rules/${file} is missing (listed in convention 012)`);
      }
    }
    if (!sources.registrySource.includes(`'${rule}':`)) {
      problems.push(`eslint/local-rules/local-rules.ts does not register '${rule}'`);
    }
    if (!sources.eslintConfigSource.includes(`'local/${rule}'`)) {
      problems.push(`eslint config does not enable 'local/${rule}'`);
    }
  }
  const checkScript =
    (JSON.parse(sources.packageJson) as { scripts?: Record<string, string> }).scripts?.check ?? '';
  for (const step of REQUIRED_CHECK_STEPS.filter((candidate) => !checkScript.includes(candidate))) {
    problems.push(`package.json: the check script must run ${step}`);
  }
  return problems;
}
