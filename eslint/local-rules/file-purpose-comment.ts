// Requires every file to open with exactly one plain `//` line saying what the file does (convention 002).
import { AST_TOKEN_TYPES } from '@typescript-eslint/utils';

import { COMMENT_FORMAT_MESSAGES } from './comment-format-messages';
import { createRule } from './create-rule';
import { validateCommentText } from './validate-comment-text';

type MessageId =
  keyof typeof COMMENT_FORMAT_MESSAGES | 'missingFileComment' | 'multiLineFileComment';

export const filePurposeComment = createRule<[], MessageId>({
  name: 'file-purpose-comment',
  meta: {
    type: 'suggestion',
    docs: { description: 'Files start with a one-line purpose comment (convention 002).' },
    schema: [],
    messages: {
      ...COMMENT_FORMAT_MESSAGES,
      missingFileComment:
        'Line 1 must be a single `//` comment saying what this file does, e.g. `// Fetches active wildfires from BCWS.` (convention 002).',
      multiLineFileComment:
        'The file purpose comment must be one line; remove the `//` line directly below it (convention 002).',
    },
  },
  create(context) {
    if (context.filename.endsWith('.d.ts')) {
      return {};
    }
    return {
      Program(node) {
        const { sourceCode } = context;
        const [firstComment, secondComment] = sourceCode.getAllComments();
        const firstToken = sourceCode.ast.tokens[0];
        const isFirstLineComment =
          firstComment?.type === AST_TOKEN_TYPES.Line &&
          firstComment.loc.start.line === 1 &&
          firstComment.loc.start.column === 0 &&
          (firstToken === undefined || firstToken.range[0] > firstComment.range[1]);
        if (firstComment === undefined || !isFirstLineComment) {
          context.report({ node, loc: { line: 1, column: 0 }, messageId: 'missingFileComment' });
          return;
        }
        const problem = validateCommentText(firstComment.value);
        if (problem !== null) {
          context.report({ loc: firstComment.loc, messageId: problem });
        }
        if (secondComment?.type === AST_TOKEN_TYPES.Line && secondComment.loc.start.line === 2) {
          context.report({ loc: secondComment.loc, messageId: 'multiLineFileComment' });
        }
      },
    };
  },
});
