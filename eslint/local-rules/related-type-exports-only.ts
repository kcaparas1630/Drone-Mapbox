// Allows exported types only when they belong to the file's single value export (convention 013).
import { readFileExports } from './read-file-exports';
import { createRule } from './create-rule';
import { getExportFileKind } from './get-export-file-kind';
import { getLeadingVerb } from './get-leading-verb';
import { toComparableName } from './to-comparable-name';
import { getRepoRelativePath } from './get-repo-relative-path';

// Returns the comparable names a related type may share: the full export, the export minus its verb, or the file.
function getExpectedNames(
  fileBaseName: string,
  valueExportName: string | null,
  isMultiExport: boolean,
): string[] {
  if (isMultiExport || valueExportName === null || valueExportName === 'default') {
    return [toComparableName(fileBaseName)];
  }
  const verb = getLeadingVerb(valueExportName);
  const noun = verb === null ? valueExportName : valueExportName.slice(verb.length);
  return [
    toComparableName(valueExportName),
    toComparableName(noun === '' ? valueExportName : noun),
  ];
}

// Returns true when the type name starts with, prefixes or suffixes the expected name.
function isRelatedName(typeName: string, expectedName: string): boolean {
  return (
    typeName.startsWith(expectedName) ||
    expectedName.startsWith(typeName) ||
    expectedName.endsWith(typeName)
  );
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
        const expectedNames = getExpectedNames(
          fileBaseName,
          values[0]?.name ?? null,
          kind === 'multiExport',
        );
        for (const exportedType of types) {
          const typeName = toComparableName(exportedType.name);
          if (!expectedNames.some((expectedName) => isRelatedName(typeName, expectedName))) {
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
