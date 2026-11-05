// Requires exactly one plain `//` line above every function and bans block comments (convention 002).
import { AST_NODE_TYPES, AST_TOKEN_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { COMMENT_FORMAT_MESSAGES } from './comment-format-messages';
import { createRule } from './create-rule';
import { validateCommentText } from './validate-comment-text';

type MessageId =
  | keyof typeof COMMENT_FORMAT_MESSAGES
  | 'missingFunctionComment'
  | 'multiLineFunctionComment'
  | 'todoIsNotAPurpose'
  | 'blockComment';

const MIN_CLASS_METHOD_LINES_REQUIRING_COMMENT = 4;

// Returns the statement a comment must sit above: the export wrapper when the node is exported.
function getCommentTarget(node: TSESTree.Node): TSESTree.Node {
  const { parent } = node;
  const isExportWrapper =
    parent?.type === AST_NODE_TYPES.ExportNamedDeclaration ||
    parent?.type === AST_NODE_TYPES.ExportDefaultDeclaration;
  return isExportWrapper ? parent : node;
}

// Returns true when a variable declaration at module level declares at least one function value.
function isModuleLevelFunctionDeclaration(node: TSESTree.VariableDeclaration): boolean {
  const isModuleLevel =
    node.parent.type === AST_NODE_TYPES.Program ||
    node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration;
  return (
    isModuleLevel &&
    node.declarations.some(
      (declarator) =>
        declarator.init?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        declarator.init?.type === AST_NODE_TYPES.FunctionExpression,
    )
  );
}

export const oneLineFunctionComment = createRule<[], MessageId>({
  name: 'one-line-function-comment',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Functions have exactly one plain-language `//` line above them (convention 002).',
    },
    schema: [],
    messages: {
      ...COMMENT_FORMAT_MESSAGES,
      missingFunctionComment:
        'Add one `//` line directly above this function saying what it does, e.g. `// Clamps the drone inside the BC bounding box.` (convention 002).',
      multiLineFunctionComment:
        'Function comments are exactly one line; merge or remove the `//` line above it (convention 002).',
      todoIsNotAPurpose:
        'A TODO is not a purpose comment; put the one-line purpose directly above the function (convention 002).',
      blockComment:
        'Block and JSDoc comments are banned; use one plain `//` line instead (convention 002).',
    },
  },
  create(context) {
    const { sourceCode } = context;

    // Reports a missing, multi-line, TODO or badly formatted comment directly above the target node.
    function validateCommentAbove(node: TSESTree.Node): void {
      const target = getCommentTarget(node);
      const comments = sourceCode.getCommentsBefore(target);
      const commentAbove = comments.at(-1);
      if (
        commentAbove?.type !== AST_TOKEN_TYPES.Line ||
        commentAbove.loc.end.line !== target.loc.start.line - 1
      ) {
        context.report({ node: target, messageId: 'missingFunctionComment' });
        return;
      }
      const commentBefore = comments.at(-2);
      if (
        commentBefore?.type === AST_TOKEN_TYPES.Line &&
        commentBefore.loc.end.line === commentAbove.loc.start.line - 1
      ) {
        context.report({ loc: commentBefore.loc, messageId: 'multiLineFunctionComment' });
      }
      if (/^\s*TODO\b/.test(commentAbove.value)) {
        context.report({ loc: commentAbove.loc, messageId: 'todoIsNotAPurpose' });
        return;
      }
      const problem = validateCommentText(commentAbove.value);
      if (problem !== null) {
        context.report({ loc: commentAbove.loc, messageId: problem });
      }
    }

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type === AST_TOKEN_TYPES.Block) {
            context.report({ loc: comment.loc, messageId: 'blockComment' });
          }
        }
      },
      FunctionDeclaration: validateCommentAbove,
      VariableDeclaration(node) {
        if (isModuleLevelFunctionDeclaration(node)) {
          validateCommentAbove(node);
        }
      },
      MethodDefinition(node) {
        const lineCount = node.value.loc.end.line - node.value.loc.start.line + 1;
        if (node.kind !== 'constructor' && lineCount >= MIN_CLASS_METHOD_LINES_REQUIRING_COMMENT) {
          validateCommentAbove(node);
        }
      },
    };
  },
});
