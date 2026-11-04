// Bans allocations inside per-frame functions of the map view and simulation entities (convention 007).
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from './create-rule';
import {
  getRenderLoopFunctionName,
  type RenderLoopFunction,
} from './get-render-loop-function-name';
import { getRepoRelativePath } from './get-repo-relative-path';

type Options = [{ paths?: string[]; names?: string[] }];
type FrameKind = 'loop' | 'closure' | 'other';

const DEFAULT_PATHS = ['^src/widgets/map-view/', '^src/entities/(drone|route|terrain|map-camera)/'];
const DEFAULT_NAMES = ['^(render|prerender|tick)$', '^(step|update|sample|apply)([A-Z0-9]|$)'];
const ALLOCATING_METHODS: ReadonlySet<string> = new Set(['map', 'filter', 'slice']);

// Returns the non-computed property name of a member-expression callee, or null.
function getCalleePropertyName(callee: TSESTree.Expression): string | null {
  if (callee.type !== AST_NODE_TYPES.MemberExpression || callee.computed) {
    return null;
  }
  return callee.property.type === AST_NODE_TYPES.Identifier ? callee.property.name : null;
}

// Returns true for `MercatorCoordinate.fromLngLat(…)` and `mapboxgl.MercatorCoordinate.fromLngLat(…)`.
function isFromLngLatCall(node: TSESTree.CallExpression): boolean {
  const { callee } = node;
  if (
    getCalleePropertyName(callee) !== 'fromLngLat' ||
    callee.type !== AST_NODE_TYPES.MemberExpression
  ) {
    return false;
  }
  const { object } = callee;
  return (
    (object.type === AST_NODE_TYPES.Identifier && object.name === 'MercatorCoordinate') ||
    getCalleePropertyName(object) === 'MercatorCoordinate'
  );
}

export const noAllocInRenderLoop = createRule<Options, 'allocation'>({
  name: 'no-alloc-in-render-loop',
  meta: {
    defaultOptions: [{ paths: DEFAULT_PATHS, names: DEFAULT_NAMES }],
    type: 'problem',
    docs: { description: 'Per-frame functions never allocate (convention 007).' },
    schema: [
      {
        type: 'object',
        properties: {
          paths: { type: 'array', items: { type: 'string' } },
          names: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      allocation:
        '{{ construct }} allocates inside a per-frame function; reuse a module-level scratch object or InstancedMesh.setMatrixAt (convention 007).',
    },
  },
  create(context, [options]) {
    const relativePath = getRepoRelativePath(context.filename, context.cwd);
    const pathPatterns = (options.paths ?? DEFAULT_PATHS).map((pattern) => new RegExp(pattern));
    const namePatterns = (options.names ?? DEFAULT_NAMES).map((pattern) => new RegExp(pattern));
    const isTestFile = /\.test\.tsx?$/.test(relativePath);
    if (isTestFile || !pathPatterns.some((pattern) => pattern.test(relativePath))) {
      return {};
    }
    const frames: FrameKind[] = [];

    // Reports the construct when the innermost enclosing function is a per-frame function.
    function reportIfInLoop(node: TSESTree.Node, construct: string): void {
      if (frames.at(-1) === 'loop') {
        context.report({ node, messageId: 'allocation', data: { construct } });
      }
    }

    // Pushes a frame for the function, reporting it as a closure when it is nested in a per-frame function.
    function openFunctionFrame(node: RenderLoopFunction): void {
      if (frames.at(-1) === 'loop') {
        reportIfInLoop(node, 'A closure');
        frames.push('closure');
        return;
      }
      const name = getRenderLoopFunctionName(node);
      const isLoop = name !== null && namePatterns.some((pattern) => pattern.test(name));
      frames.push(isLoop ? 'loop' : 'other');
    }

    // Pops the frame pushed when the function was entered.
    function closeFunctionFrame(): void {
      frames.pop();
    }

    return {
      FunctionDeclaration: openFunctionFrame,
      FunctionExpression: openFunctionFrame,
      ArrowFunctionExpression: openFunctionFrame,
      'FunctionDeclaration:exit': closeFunctionFrame,
      'FunctionExpression:exit': closeFunctionFrame,
      'ArrowFunctionExpression:exit': closeFunctionFrame,
      NewExpression: (node) => {
        reportIfInLoop(node, '`new`');
      },
      ArrayExpression: (node) => {
        reportIfInLoop(node, 'An array literal');
      },
      ObjectExpression: (node) => {
        reportIfInLoop(node, 'An object literal');
      },
      SpreadElement: (node) => {
        reportIfInLoop(node, 'A spread');
      },
      CallExpression: (node) => {
        const methodName = getCalleePropertyName(node.callee);
        if (isFromLngLatCall(node)) {
          reportIfInLoop(node, '`MercatorCoordinate.fromLngLat()`');
        } else if (methodName !== null && ALLOCATING_METHODS.has(methodName)) {
          reportIfInLoop(node, `\`.${methodName}()\``);
        }
      },
    };
  },
});
