// Requires function and method names to start with an approved verb (convention 001).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from './create-rule';
import { getLeadingVerb } from './get-leading-verb';
import { isInsideCallArgument } from './is-inside-call-argument';

type Options = [{ allowedNames?: string[] }];

const FUNCTION_VALUE_TYPES: ReadonlySet<string> = new Set([
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.FunctionExpression,
]);

// Returns true for names the rule never checks: components, classes and React hooks.
function isExemptName(name: string): boolean {
  return /^[A-Z]/.test(name) || /^use[A-Z0-9]/.test(name);
}

// Returns true when a variable declarator sits at module level, exported or not.
function isModuleLevelDeclarator(node: TSESTree.VariableDeclarator): boolean {
  const declaration = node.parent;
  const container = declaration.parent;
  return (
    container.type === AST_NODE_TYPES.Program ||
    container.type === AST_NODE_TYPES.ExportNamedDeclaration
  );
}

export const functionNameStartsWithVerb = createRule<Options, 'missingVerb'>({
  name: 'function-name-starts-with-verb',
  meta: {
    defaultOptions: [{ allowedNames: [] }],
    type: 'suggestion',
    docs: {
      description: 'Function and method names start with an approved verb (convention 001).',
    },
    schema: [
      {
        type: 'object',
        properties: { allowedNames: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      missingVerb:
        '`{{ name }}` must start with an approved verb from eslint/approved-verbs.ts, e.g. loadDroneModel or computeChaseCamera (convention 001).',
    },
  },
  create(context, [options]) {
    const allowedNames = new Set(options.allowedNames);

    // Reports the identifier when its name is neither exempt, allow-listed nor verb-first.
    function validateName(identifier: TSESTree.Identifier): void {
      const { name } = identifier;
      if (isExemptName(name) || allowedNames.has(name) || getLeadingVerb(name) !== null) {
        return;
      }
      context.report({ node: identifier, messageId: 'missingVerb', data: { name } });
    }

    return {
      FunctionDeclaration(node) {
        if (node.id !== null) {
          validateName(node.id);
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type === AST_NODE_TYPES.Identifier &&
          node.init !== null &&
          FUNCTION_VALUE_TYPES.has(node.init.type) &&
          isModuleLevelDeclarator(node)
        ) {
          validateName(node.id);
        }
      },
      MethodDefinition(node) {
        if (
          node.kind === 'method' &&
          !node.computed &&
          node.key.type === AST_NODE_TYPES.Identifier
        ) {
          validateName(node.key);
        }
      },
      Property(node) {
        const isFunctionValued = node.method || FUNCTION_VALUE_TYPES.has(node.value.type);
        if (
          !isFunctionValued ||
          node.kind !== 'init' ||
          node.computed ||
          node.key.type !== AST_NODE_TYPES.Identifier ||
          node.parent.type !== AST_NODE_TYPES.ObjectExpression ||
          isInsideCallArgument(node.parent)
        ) {
          return;
        }
        validateName(node.key);
      },
    };
  },
});
