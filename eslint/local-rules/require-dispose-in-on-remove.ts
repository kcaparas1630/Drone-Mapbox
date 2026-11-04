// Requires every object or class with onAdd to dispose GPU resources in onRemove (convention 007).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from './create-rule';

type MessageId = 'missingOnRemove' | 'missingDispose';
type Member = TSESTree.ClassElement | TSESTree.ObjectLiteralElement;

// Returns the non-computed identifier name of a class or object member, or null.
function getMemberName(member: Member): string | null {
  if (member.type !== AST_NODE_TYPES.Property && member.type !== AST_NODE_TYPES.MethodDefinition) {
    return null;
  }
  return !member.computed && member.key.type === AST_NODE_TYPES.Identifier ? member.key.name : null;
}

// Returns true for `x.dispose()`, `disposeX()` or `x.disposeY()` calls.
function isDisposeCall(node: TSESTree.CallExpression): boolean {
  const { callee } = node;
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return callee.name.startsWith('dispose');
  }
  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name.startsWith('dispose')
  );
}

// Returns true when any call inside the subtree disposes something.
function hasDisposeCall(
  root: TSESTree.Node,
  visitorKeys: Record<string, readonly string[] | undefined>,
): boolean {
  const pending: TSESTree.Node[] = [root];
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined) {
      break;
    }
    if (current.type === AST_NODE_TYPES.CallExpression && isDisposeCall(current)) {
      return true;
    }
    for (const key of visitorKeys[current.type] ?? []) {
      const child: unknown = (current as unknown as Record<string, unknown>)[key];
      const children = Array.isArray(child) ? child : [child];
      for (const candidate of children) {
        if (typeof candidate === 'object' && candidate !== null && 'type' in candidate) {
          pending.push(candidate as TSESTree.Node);
        }
      }
    }
  }
  return false;
}

export const requireDisposeInOnRemove = createRule<[], MessageId>({
  name: 'require-dispose-in-on-remove',
  meta: {
    type: 'problem',
    docs: { description: 'Custom layers dispose their resources in onRemove (convention 007).' },
    schema: [],
    messages: {
      missingOnRemove:
        'An object with onAdd must also define onRemove that disposes geometries, materials and textures (convention 007).',
      missingDispose:
        'onRemove must call `.dispose()` (or a `dispose*` function) on what onAdd created (convention 007).',
    },
  },
  create(context) {
    const { visitorKeys } = context.sourceCode;

    // Checks a list of class or object members for an onAdd without a disposing onRemove.
    function validateMembers(members: readonly Member[]): void {
      const onAdd = members.find((member) => getMemberName(member) === 'onAdd');
      if (onAdd === undefined) {
        return;
      }
      const onRemove = members.find((member) => getMemberName(member) === 'onRemove');
      if (onRemove === undefined) {
        context.report({ node: onAdd, messageId: 'missingOnRemove' });
        return;
      }
      if (!hasDisposeCall(onRemove, visitorKeys)) {
        context.report({ node: onRemove, messageId: 'missingDispose' });
      }
    }

    return {
      ObjectExpression(node) {
        validateMembers(node.properties);
      },
      ClassBody(node) {
        validateMembers(node.body);
      },
    };
  },
});
