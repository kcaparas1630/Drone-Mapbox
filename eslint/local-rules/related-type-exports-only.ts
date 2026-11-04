// Allows exported types only when they belong to the file's single value export (convention 013).
import { readFileExports } from './read-file-exports';
import { createRule } from './create-rule';
import { getExportFileKind } from './get-export-file-kind';
import { getLeadingVerb } from './get-leading-verb';
import { toComparableName } from './to-comparable-name';
import { getRepoRelativePath } from './get-repo-relative-path';

// Returns the comparable noun a related type must share: the export minus its verb, or the file name.
function getExpectedNoun(
  fileBaseName: string,
  valueExportName: string | null,
  isMultiExport: boolean,
): string {
  if (isMultiExport || valueExportName === null || valueExportName === 'default') {
    return toComparableName(fileBaseName);
  }
  const verb = getLeadingVerb(valueExportName);
  const noun = verb === null ? valueExportName : valueExportName.slice(verb.length);
  return toComparableName(noun === '' ? valueExportName : noun);
}

export const relatedTypeExportsOnly = createRule<[], 'unrelatedType'>({
  name: 'related-type-exports-only',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Exported types belong to the file export they describe (convention 013).',
    },
    schema: [],
    messages: {
      unrelatedType:
        "The type `{{ name }}` is unrelated to this file's export; name it after the export (e.g. `{{ noun }}Props`) or move it to a `*.types.ts` file (convention 013).",
    },
  },
  create(context) {
    const relativePath = getRepoRelativePath(context.filename, context.cwd);
    const kind = getExportFileKind(relativePath);
    if (kind === 'exempt' || kind === 'index' || kind === 'typesOnly') {
      return {};
    }
    return {
      Program(program) {
        const { values, types } = readFileExports(program);
        const fileBaseName = (relativePath.split('/').at(-1) ?? '').split('.')[0] ?? '';
        const noun = getExpectedNoun(fileBaseName, values[0]?.name ?? null, kind === 'multiExport');
        for (const exportedType of types) {
          const typeName = toComparableName(exportedType.name);
          const isRelated =
            typeName.startsWith(noun) || noun.startsWith(typeName) || noun.endsWith(typeName);
          if (!isRelated) {
            context.report({
              node: exportedType.node,
              messageId: 'unrelatedType',
              data: { name: exportedType.name, noun: values[0]?.name ?? fileBaseName },
            });
          }
        }
      },
    };
  },
});
