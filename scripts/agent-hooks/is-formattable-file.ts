// Decides whether the PostToolUse hook should format an edited file (convention 012).

const FORMATTABLE_EXTENSION = /\.(ts|tsx|css|md|json)$/;

// Returns true for .ts/.tsx/.css/.md/.json files outside node_modules.
export function isFormattableFile(filePath: string): boolean {
  const normalized = filePath.replaceAll('\\', '/');
  return FORMATTABLE_EXTENSION.test(normalized) && !normalized.includes('/node_modules/');
}
