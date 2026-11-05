// Picks the files whose content decides whether the Stop hook must re-run `bun run check` (convention 012).

const CHECKED_FOLDER = /^(src|e2e|scripts|eslint|public)\//;
const CHECKED_ROOT_FILE =
  /^(package\.json|bun\.lock|tsconfig[\w.-]*\.json|[\w.-]+\.config\.[cm]?[jt]s|vitest\.setup\.ts|index\.html|\.prettierignore)$/;
const CHECKED_EXTRA_FILES: ReadonlySet<string> = new Set([
  '.claude/settings.json',
  'docs/code-convention/012-agent-hooks-enforcement.md',
]);

// Returns the sorted subset of repo-relative paths that the check depends on.
export function selectCheckedFiles(paths: readonly string[]): string[] {
  return paths
    .filter(
      (path) =>
        CHECKED_FOLDER.test(path) || CHECKED_ROOT_FILE.test(path) || CHECKED_EXTRA_FILES.has(path),
    )
    .sort();
}
