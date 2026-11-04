// Allows .css imports only inside src/app, where the global stylesheets live (convention 009).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from './create-rule';
import { getRepoRelativePath } from './get-repo-relative-path';

const CSS_SOURCE = /\.css(\?.*)?$/;

export const noCssFileOutsideApp = createRule<[], 'cssOutsideApp'>({
  name: 'no-css-file-outside-app',
  meta: {
    type: 'problem',
    docs: { description: 'CSS files are imported only in src/app (convention 009).' },
    schema: [],
    messages: {
      cssOutsideApp:
        'Import .css only in src/app (globals.css, mapbox-gl.css); style components with Tailwind classes (convention 009).',
    },
  },
  create(context) {
    const relativePath = getRepoRelativePath(context.filename, context.cwd);
    if (relativePath.startsWith('src/app/')) {
      return {};
    }

    // Reports the import when its source is a literal path to a .css file.
    function validateImportSource(node: TSESTree.Node, source: TSESTree.Node): void {
      if (
        source.type === AST_NODE_TYPES.Literal &&
        typeof source.value === 'string' &&
        CSS_SOURCE.test(source.value)
      ) {
        context.report({ node, messageId: 'cssOutsideApp' });
      }
    }

    return {
      ImportDeclaration(node) {
        validateImportSource(node, node.source);
      },
      ImportExpression(node) {
        validateImportSource(node, node.source);
      },
    };
  },
});
