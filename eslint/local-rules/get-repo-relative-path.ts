// Converts an ESLint filename into a forward-slash path relative to the repository root.

// Returns the file path relative to cwd with forward slashes, or the normalised input when outside cwd.
export function getRepoRelativePath(filename: string, cwd: string): string {
  const normalizedFile = filename.replaceAll('\\', '/');
  const normalizedCwd = cwd.replaceAll('\\', '/').replace(/\/+$/, '');
  const cwdPrefix = `${normalizedCwd.toLowerCase()}/`;
  if (normalizedCwd !== '' && normalizedFile.toLowerCase().startsWith(cwdPrefix)) {
    return normalizedFile.slice(cwdPrefix.length);
  }
  return normalizedFile.replace(/^\.\//, '');
}
