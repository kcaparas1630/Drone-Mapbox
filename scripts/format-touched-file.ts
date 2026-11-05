// PostToolUse hook: formats the file an agent just edited with Prettier and ESLint --fix; never blocks (012).
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { z } from 'zod';

import { findFireflybcRoot } from './agent-hooks/find-fireflybc-root';
import { isFormattableFile } from './agent-hooks/is-formattable-file';

// Claude Code's hook payload uses snake_case keys; computed keys keep them out of the naming rule.
const TOOL_INPUT_KEY = 'tool_input';
const FILE_PATH_KEY = 'file_path';
const hookInputSchema = z.object({ [TOOL_INPUT_KEY]: z.object({ [FILE_PATH_KEY]: z.string() }) });

// Returns the package name in the directory's package.json, or null when there is none.
function readPackageName(directory: string): string | null {
  try {
    const parsed = z
      .object({ name: z.string() })
      .safeParse(JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')));
    return parsed.success ? parsed.data.name : null;
  } catch {
    return null;
  }
}

// Runs a locally installed CLI through `bun x` in the checkout root, ignoring its output.
function runLocalTool(root: string, args: string[]): void {
  spawnSync('bun', ['x', ...args], { cwd: root, stdio: 'ignore' });
}

// Formats the edited file with the tools of the checkout that contains it.
function formatTouchedFile(): void {
  const input = hookInputSchema.safeParse(JSON.parse(readFileSync(0, 'utf8')));
  if (!input.success) {
    return;
  }
  const filePath = input.data[TOOL_INPUT_KEY][FILE_PATH_KEY];
  const root = isFormattableFile(filePath) ? findFireflybcRoot(filePath, readPackageName) : null;
  if (root === null) {
    return;
  }
  runLocalTool(root, [
    'prettier',
    '--write',
    '--ignore-unknown',
    '--log-level',
    'silent',
    filePath,
  ]);
  if (/\.tsx?$/.test(filePath)) {
    runLocalTool(root, ['eslint', '--fix', '--no-warn-ignored', filePath]);
  }
}

try {
  formatTouchedFile();
} catch (error) {
  console.error(`format-touched-file: skipped (${String(error)})`);
}
process.exit(0);
