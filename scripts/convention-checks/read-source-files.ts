// Reads repository files as text for the convention checks.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { SourceFile } from './convention-check.types';
import { REPO_ROOT } from './repo-root';

// Returns the UTF-8 content of each repo-relative path.
export function readSourceFiles(paths: readonly string[]): SourceFile[] {
  return paths.map((path) => ({ path, content: readFileSync(join(REPO_ROOT, path), 'utf8') }));
}
