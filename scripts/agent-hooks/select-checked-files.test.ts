// Tests which files invalidate the Stop hook's last successful check.
import { describe, expect, it } from 'vitest';

import { selectCheckedFiles } from './select-checked-files';

describe('selectCheckedFiles', () => {
  it('keeps source folders, root configs and hook settings, sorted', () => {
    const paths = [
      'src/app/app.tsx',
      'vite.config.ts',
      'package.json',
      'tsconfig.app.json',
      '.claude/settings.json',
      'eslint/approved-verbs.ts',
    ];
    expect(selectCheckedFiles(paths)).toEqual([
      '.claude/settings.json',
      'eslint/approved-verbs.ts',
      'package.json',
      'src/app/app.tsx',
      'tsconfig.app.json',
      'vite.config.ts',
    ]);
  });

  it('drops owner docs other than convention 012 and unrelated files', () => {
    const paths = [
      'docs/behaviour.md',
      'README.md',
      'docs/code-convention/012-agent-hooks-enforcement.md',
    ];
    expect(selectCheckedFiles(paths)).toEqual([
      'docs/code-convention/012-agent-hooks-enforcement.md',
    ]);
  });
});
