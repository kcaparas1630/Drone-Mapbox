// Finds the FireflyBC checkout (main tree or git worktree) that contains an edited file.
import { dirname } from 'node:path';

// Walks up from the file to the nearest directory whose package.json is named fireflybc, else null.
export function findFireflybcRoot(
  filePath: string,
  readPackageName: (directory: string) => string | null,
): string | null {
  let directory = dirname(filePath);
  for (;;) {
    if (readPackageName(directory) === 'fireflybc') {
      return directory;
    }
    const parent = dirname(directory);
    if (parent === directory) {
      return null;
    }
    directory = parent;
  }
}
