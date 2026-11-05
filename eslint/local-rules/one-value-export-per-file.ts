// Enforces one value export per file, named after the file, and re-export-only index files (convention 013).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { readFileExports } from './read-file-exports';
import { createRule } from './create-rule';
import { getExportFileKind } from './get-export-file-kind';
import { getRepoRelativePath } from './get-repo-relative-path';
import { isNameMatchingFile } from './is-name-matching-file';

type MessageId = 'indexOnlyReexports' | 'tooManyValueExports' | 'valueInTypesFile' | 'nameMismatch';

// Returns true for statements an index.ts may contain: `export … from`, `export *` and `export {}`.
function isReexportStatement(statement: TSESTree.ProgramStatement): boolean {
  if (statement.type === AST_NODE_TYPES.ExportAllDeclaration) {
    return true;
  }
  if (statement.type !== AST_NODE_TYPES.ExportNamedDeclaration || statement.declaration !== null) {
    return false;
  }
  return statement.source !== null || statement.specifiers.length === 0;
}

export const oneValueExportPerFile = createRule<[], MessageId>({
  name: 'one-value-export-per-file',
  meta: {
    type: 'suggestion',
    docs: { description: 'A file has one value export named after the file (convention 013).' },
    schema: [],
    messages: {
      indexOnlyReexports:
        'index.ts is a public API: it may only contain `export … from` statements; move this into its own file (convention 013).',
      tooManyValueExports:
        'This file already exports a value; move `{{ name }}` into its own file named after it (convention 013).',
      valueInTypesFile:
        '*.types.ts files hold types only; move `{{ name }}` into its own file (convention 013).',
      nameMismatch:
        'The export `{{ name }}` must match the file name `{{ fileName }}` (e.g. plan-geodesic-route.ts exports planGeodesicRoute) (convention 013).',
    },
  },
  create(context) {
    const relativePath = getRepoRelativePath(context.filename, context.cwd);
    const kind = getExportFileKind(relativePath);
    if (kind === 'exempt' || kind === 'multiExport') {
      return {};
    }
    return {
      Program(program) {
        if (kind === 'index') {
          for (const statement of program.body.filter(
            (candidate) => !isReexportStatement(candidate),
          )) {
            context.report({ node: statement, messageId: 'indexOnlyReexports' });
          }
          return;
        }
        const { values, defaultExportLocalName } = readFileExports(program);
        const isPageAlias =
          relativePath.startsWith('src/pages/') && defaultExportLocalName !== null;
        const counted = isPageAlias ? values.filter((value) => value.name !== 'default') : values;
        if (kind === 'typesOnly') {
          for (const value of counted) {
            context.report({
              node: value.node,
              messageId: 'valueInTypesFile',
              data: { name: value.name },
            });
          }
          return;
        }
        const [first, ...extra] = counted;
        for (const value of extra) {
          context.report({
            node: value.node,
            messageId: 'tooManyValueExports',
            data: { name: value.name },
          });
        }
        const fileName = relativePath.split('/').at(-1) ?? '';
        const baseName = fileName.split('.')[0] ?? '';
        if (
          first !== undefined &&
          first.name !== 'default' &&
          !isNameMatchingFile(first.name, baseName)
        ) {
          context.report({
            node: first.node,
            messageId: 'nameMismatch',
            data: { name: first.name, fileName },
          });
        }
      },
    };
  },
});
