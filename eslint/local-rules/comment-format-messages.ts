// Message texts shared by the two comment rules for each purpose-comment format problem (convention 002).
import type { CommentTextProblem } from './validate-comment-text';

export const COMMENT_FORMAT_MESSAGES: Record<CommentTextProblem, string> = {
  emptyComment:
    'The purpose comment is empty; say in one plain line what this does (convention 002).',
  notCapitalized: 'The purpose comment must start with a capital letter (convention 002).',
  missingPeriod: 'The purpose comment must end with a period (convention 002).',
  tooLong: 'The purpose comment must be at most 120 characters (convention 002).',
};
