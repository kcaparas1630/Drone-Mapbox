// Finds the name of a function node so the render-loop rule can tell which functions run every frame.
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

export type RenderLoopFunction =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

// Returns the declared, assigned, property or method name of a function, or null when it is anonymous.
export function getRenderLoopFunctionName(node: RenderLoopFunction): string | null {
  if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
    return node.id?.name ?? null;
  }
  const { parent } = node;
  if (
    parent.type === AST_NODE_TYPES.VariableDeclarator &&
    parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return parent.id.name;
  }
  if (parent.type !== AST_NODE_TYPES.Property && parent.type !== AST_NODE_TYPES.MethodDefinition) {
    return null;
  }
  return !parent.computed && parent.key.type === AST_NODE_TYPES.Identifier ? parent.key.name : null;
}
