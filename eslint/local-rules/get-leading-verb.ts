// Finds the approved verb a camelCase identifier starts with, using the convention 001 verb list.
import { APPROVED_VERBS } from '../approved-verbs';

const APPROVED_VERB_SET: ReadonlySet<string> = new Set(APPROVED_VERBS);

// Returns the leading lowercase word of a camelCase name when it is an approved verb, else null.
export function getLeadingVerb(name: string): string | null {
  const leadingWord = /^[a-z]+/.exec(name)?.[0];
  if (leadingWord === undefined || !APPROVED_VERB_SET.has(leadingWord)) {
    return null;
  }
  return leadingWord;
}
