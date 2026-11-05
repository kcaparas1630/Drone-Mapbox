// Decides whether an export name matches its kebab-case file name (convention 013).
import { getLeadingVerb } from './get-leading-verb';
import { toComparableName } from './to-comparable-name';

// Returns true when the export equals the file base name, optionally prefixed by an approved verb.
export function isNameMatchingFile(exportName: string, fileBaseName: string): boolean {
  const comparableFile = toComparableName(fileBaseName);
  if (toComparableName(exportName) === comparableFile) {
    return true;
  }
  const verb = getLeadingVerb(exportName);
  return verb !== null && toComparableName(exportName.slice(verb.length)) === comparableFile;
}
