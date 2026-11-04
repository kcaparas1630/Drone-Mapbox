// Bans the global fetch outside src/shared/api so every response passes through fetchJson (convention 008).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from './create-rule';
import { getRepoRelativePath } from './get-repo-relative-path';

const GLOBAL_OBJECTS: ReadonlySet<string> = new Set(['window', 'globalThis', 'self']);

export const fetchThroughSharedApi = createRule<[], 'globalFetch'>({
  name: 'fetch-through-shared-api',
  meta: {
    type: 'problem',
    docs: { description: 'Network calls go through fetchJson in shared/api (convention 008).' },
    schema: [],
    messages: {
      globalFetch:
        'Do not call fetch directly; use `fetchJson(url, schema, …)` from `@/shared/api` so the response is validated (convention 008).',
    },
  },
  create(context) {
    const relativePath = getRepoRelativePath(context.filename, context.cwd);
    if (!relativePath.startsWith('src/') || relativePath.startsWith('src/shared/api/')) {
      return {};
    }

    // Returns true when the identifier resolves to a global (not a local or imported binding).
    function isGlobalReference(node: TSESTree.Identifier): boolean {
      let scope: ReturnType<typeof context.sourceCode.getScope> | null =
        context.sourceCode.getScope(node);
      while (scope !== null) {
        const variable = scope.set.get(node.name);
        if (variable !== undefined && variable.defs.length > 0) {
          return false;
        }
        scope = scope.upper;
      }
      return true;
    }

    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          callee.type === AST_NODE_TYPES.Identifier &&
          callee.name === 'fetch' &&
          isGlobalReference(callee)
        ) {
          context.report({ node, messageId: 'globalFetch' });
          return;
        }
        const isGlobalMemberFetch =
          callee.type === AST_NODE_TYPES.MemberExpression &&
          !callee.computed &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          callee.property.name === 'fetch' &&
          callee.object.type === AST_NODE_TYPES.Identifier &&
          GLOBAL_OBJECTS.has(callee.object.name) &&
          isGlobalReference(callee.object);
        if (isGlobalMemberFetch) {
          context.report({ node, messageId: 'globalFetch' });
        }
      },
    };
  },
});
