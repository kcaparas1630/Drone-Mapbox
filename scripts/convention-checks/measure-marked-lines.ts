// Counts marker comments (to-do notes, lint disables) in source files and flags the ones that break the rules.

import type { MarkedLineCount, MarkerRule, SourceFile } from './convention-check.types';

// Returns how many lines carry the marker and one problem per malformed or forbidden occurrence.
export function measureMarkedLines(
  files: readonly SourceFile[],
  rule: MarkerRule,
): MarkedLineCount {
  const problems: string[] = [];
  let count = 0;
  for (const file of files) {
    const lines = file.content.split('\n');
    for (const [index, line] of lines.entries()) {
      const isForbidden = rule.isAlwaysForbidden?.(line) ?? false;
      if (!rule.marker.test(line) && !isForbidden) {
        continue;
      }
      count += 1;
      if (isForbidden || !rule.isWellFormed(line)) {
        problems.push(`${file.path}:${String(index + 1)}: ${rule.fixHint}`);
      }
    }
  }
  return { count, problems };
}
