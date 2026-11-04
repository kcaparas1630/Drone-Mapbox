// Bans vague standalone binding names such as data, item or callback (convention 001).
import { createRule } from './create-rule';

const VAGUE_IDENTIFIERS: ReadonlySet<string> = new Set([
  'data',
  'item',
  'items',
  'obj',
  'tmp',
  'temp',
  'foo',
  'bar',
  'baz',
  'stuff',
  'thing',
  'misc',
  'flag',
  'arr',
  'list',
  'str',
  'num',
  'val',
  'info',
  'res',
  'req',
  'cb',
  'fn',
  'callback',
  'handler',
  'manager',
  'helper',
  'util',
]);

export const noVagueIdentifier = createRule<[], 'vagueIdentifier'>({
  name: 'no-vague-identifier',
  meta: {
    type: 'suggestion',
    docs: { description: 'Bindings have names that state what they hold (convention 001).' },
    schema: [],
    messages: {
      vagueIdentifier:
        '`{{ name }}` is too vague; name what it holds (e.g. `fires`, `onFireSelected`). Longer names like `fireData` are fine (convention 001).',
    },
  },
  create(context) {
    return {
      'Program:exit'() {
        const { scopeManager } = context.sourceCode;
        if (scopeManager === null) {
          return;
        }
        for (const scope of scopeManager.scopes) {
          for (const variable of scope.variables) {
            if (!VAGUE_IDENTIFIERS.has(variable.name)) {
              continue;
            }
            for (const identifier of variable.identifiers) {
              context.report({
                node: identifier,
                messageId: 'vagueIdentifier',
                data: { name: variable.name },
              });
            }
          }
        }
      },
    };
  },
});
