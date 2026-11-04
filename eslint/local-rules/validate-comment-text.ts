// Checks a one-line purpose comment against the convention 002 format.

export type CommentTextProblem = 'emptyComment' | 'notCapitalized' | 'missingPeriod' | 'tooLong';

const MAX_COMMENT_LENGTH = 120;

// Returns the first format problem of a `//` comment body, or null when it is a valid purpose line.
export function validateCommentText(rawValue: string): CommentTextProblem | null {
  const text = rawValue.trim();
  if (text === '') {
    return 'emptyComment';
  }
  if (!/^[A-Z]/.test(text)) {
    return 'notCapitalized';
  }
  if (!text.endsWith('.')) {
    return 'missingPeriod';
  }
  if (text.length > MAX_COMMENT_LENGTH) {
    return 'tooLong';
  }
  return null;
}
