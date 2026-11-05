// Requires createSlice reducer names to be past-tense events such as routePlanned (convention 005).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { APPROVED_VERBS } from '../approved-verbs';
import { createRule } from './create-rule';

type Options = [{ allow?: string[] }];
type ToolkitImportNames = { createSlice: Set<string>; namespaces: Set<string> };

const PRESENT_TENSE_VERBS: ReadonlySet<string> = new Set(APPROVED_VERBS);
const PAST_TENSE_ENDING = /(ed|en|t)$/;

// Returns the last camelCase word of a name in lower case (`routeCleared` → `cleared`).
function getLastWord(name: string): string {
  const words = name.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?![a-z])/g) ?? [name];
  return (words.at(-1) ?? name).toLowerCase();
}

// Returns the object literal holding reducers, for both the object and the builder-callback form.
function getReducersObject(value: TSESTree.Node): TSESTree.ObjectExpression | null {
  if (value.type === AST_NODE_TYPES.ObjectExpression) {
    return value;
  }
  if (value.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    const { body } = value;
    if (body.type === AST_NODE_TYPES.ObjectExpression) {
      return body;
    }
    const returned = body.type === AST_NODE_TYPES.BlockStatement ? body.body.at(-1) : undefined;
    if (
      returned?.type === AST_NODE_TYPES.ReturnStatement &&
      returned.argument?.type === AST_NODE_TYPES.ObjectExpression
    ) {
      return returned.argument;
    }
  }
  return null;
}

// Records the local names under which `createSlice` or the whole toolkit namespace is imported.
function registerToolkitImport(node: TSESTree.ImportDeclaration, names: ToolkitImportNames): void {
  if (node.source.value !== '@reduxjs/toolkit') {
    return;
  }
  for (const specifier of node.specifiers) {
    if (specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
      names.namespaces.add(specifier.local.name);
    } else if (
      specifier.type === AST_NODE_TYPES.ImportSpecifier &&
      specifier.imported.type === AST_NODE_TYPES.Identifier &&
      specifier.imported.name === 'createSlice'
    ) {
      names.createSlice.add(specifier.local.name);
    }
  }
}

// Returns true when the call is RTK's createSlice, imported directly, aliased or via a namespace.
function isCreateSliceCall(node: TSESTree.CallExpression, names: ToolkitImportNames): boolean {
  const { callee } = node;
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return names.createSlice.has(callee.name);
  }
  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.Identifier &&
    names.namespaces.has(callee.object.name) &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === 'createSlice'
  );
}

export const reduxActionPastTense = createRule<Options, 'notPastTense'>({
  name: 'redux-action-past-tense',
  meta: {
    defaultOptions: [{ allow: [] }],
    type: 'suggestion',
    docs: { description: 'createSlice reducers are named as past-tense events (convention 005).' },
    schema: [
      {
        type: 'object',
        properties: { allow: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      notPastTense:
        'Reducer `{{ name }}` must be a past-tense event, e.g. `routePlanned`, `routeCleared` (not `reset`/`clear`/`setX`) (convention 005).',
    },
  },
  create(context, [options]) {
    const allowed = new Set(options.allow);
    const toolkitNames: ToolkitImportNames = { createSlice: new Set(), namespaces: new Set() };

    // Reports every reducer key in the object that is not a past-tense event name.
    function validateReducerKeys(reducers: TSESTree.ObjectExpression): void {
      for (const property of reducers.properties) {
        if (property.type !== AST_NODE_TYPES.Property || property.computed) {
          continue;
        }
        const { key } = property;
        const name = key.type === AST_NODE_TYPES.Identifier ? key.name : String(key.value);
        const lastWord = getLastWord(name);
        const isPastTense = PAST_TENSE_ENDING.test(lastWord) && !PRESENT_TENSE_VERBS.has(lastWord);
        if (!isPastTense && !allowed.has(name)) {
          context.report({ node: key, messageId: 'notPastTense', data: { name } });
        }
      }
    }

    return {
      ImportDeclaration(node) {
        registerToolkitImport(node, toolkitNames);
      },
      CallExpression(node) {
        const [options] = node.arguments;
        if (
          !isCreateSliceCall(node, toolkitNames) ||
          options?.type !== AST_NODE_TYPES.ObjectExpression
        ) {
          return;
        }
        for (const property of options.properties) {
          const isReducersKey =
            property.type === AST_NODE_TYPES.Property &&
            property.key.type === AST_NODE_TYPES.Identifier &&
            property.key.name === 'reducers';
          const reducers = isReducersKey ? getReducersObject(property.value) : null;
          if (reducers !== null) {
            validateReducerKeys(reducers);
          }
        }
      },
    };
  },
});
