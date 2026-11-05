// Normalises identifiers and file names so kebab, camel, Pascal and UPPER_SNAKE forms compare equal.

// Returns the name lower-cased with `-`, `_` and `.` removed.
export function toComparableName(name: string): string {
  return name.toLowerCase().replaceAll(/[-_.]/g, '');
}
