// Decides whether an object literal is (possibly nested) configuration passed as a call argument.
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

const TRANSPARENT_PARENTS: ReadonlySet<string> = new Set([
  AST_NODE_TYPES.ObjectExpression,
  AST_NODE_TYPES.ArrayExpression,
  AST_NODE_TYPES.Property,
  AST_NODE_TYPES.TSAsExpression,
  AST_NODE_TYPES.TSSatisfiesExpression,
]);

// Returns true when walking up through object/array/property wrappers reaches a call or new argument.
export function isInsideCallArgument(node: TSESTree.Node): boolean {
  let child: TSESTree.Node = node;
  let parent = node.parent;
  while (parent !== undefined && TRANSPARENT_PARENTS.has(parent.type)) {
    child = parent;
    parent = parent.parent;
  }
  if (
    parent?.type === AST_NODE_TYPES.CallExpression ||
    parent?.type === AST_NODE_TYPES.NewExpression
  ) {
    return parent.arguments.includes(child as TSESTree.CallExpressionArgument);
  }
  return false;
}
