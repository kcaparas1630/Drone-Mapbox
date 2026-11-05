// Collects the value and type exports of a module so the convention 013 rules can count and name them.
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

export type FileExport = { name: string; node: TSESTree.Node };

export type FileExports = {
  values: FileExport[];
  types: FileExport[];
  defaultExportLocalName: string | null;
};

// Adds the names bound by a declaration exported with `export <declaration>`.
function addDeclarationExports(
  declaration: TSESTree.NamedExportDeclarations,
  collected: FileExports,
): void {
  switch (declaration.type) {
    case AST_NODE_TYPES.TSTypeAliasDeclaration:
    case AST_NODE_TYPES.TSInterfaceDeclaration:
      collected.types.push({ name: declaration.id.name, node: declaration.id });
      return;
    case AST_NODE_TYPES.VariableDeclaration:
      for (const declarator of declaration.declarations) {
        const name = declarator.id.type === AST_NODE_TYPES.Identifier ? declarator.id.name : '{…}';
        collected.values.push({ name, node: declarator.id });
      }
      return;
    case AST_NODE_TYPES.FunctionDeclaration:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.TSDeclareFunction:
    case AST_NODE_TYPES.TSEnumDeclaration:
      collected.values.push({ name: declaration.id?.name ?? 'default', node: declaration });
      return;
    case AST_NODE_TYPES.TSModuleDeclaration:
    case AST_NODE_TYPES.TSImportEqualsDeclaration:
      collected.values.push({ name: 'namespace', node: declaration });
      return;
  }
}

// Adds the specifiers of `export { a, type B }` or `export { a } from './x'`.
function addSpecifierExports(node: TSESTree.ExportNamedDeclaration, collected: FileExports): void {
  for (const specifier of node.specifiers) {
    const name =
      specifier.exported.type === AST_NODE_TYPES.Identifier
        ? specifier.exported.name
        : specifier.exported.value;
    const isType = node.exportKind === 'type' || specifier.exportKind === 'type';
    (isType ? collected.types : collected.values).push({ name, node: specifier });
  }
}

// Returns every value and type export of the program, plus the local name behind `export default`.
export function readFileExports(program: TSESTree.Program): FileExports {
  const collected: FileExports = { values: [], types: [], defaultExportLocalName: null };
  for (const statement of program.body) {
    if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration) {
      if (statement.declaration === null) {
        addSpecifierExports(statement, collected);
      } else {
        addDeclarationExports(statement.declaration, collected);
      }
    } else if (statement.type === AST_NODE_TYPES.ExportAllDeclaration) {
      const isType = statement.exportKind === 'type';
      (isType ? collected.types : collected.values).push({ name: '*', node: statement });
    } else if (statement.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
      const { declaration } = statement;
      if (declaration.type === AST_NODE_TYPES.Identifier) {
        collected.defaultExportLocalName = declaration.name;
      }
      collected.values.push({ name: 'default', node: statement });
    }
  }
  return collected;
}
