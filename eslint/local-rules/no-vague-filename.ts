// Bans vague file and folder names and enforces FSD segment names inside slices (convention 001).
import { createRule } from './create-rule';
import { getRepoRelativePath } from './get-repo-relative-path';

const VAGUE_SEGMENTS: ReadonlySet<string> = new Set([
  'utils',
  'util',
  'helpers',
  'helper',
  'misc',
  'common',
  'stuff',
  'temp',
  'tmp',
  'new',
  'old',
  'functions',
  'handlers',
  'manager',
  'service',
  'data',
]);
const GENERIC_FILE_NAMES: ReadonlySet<string> = new Set(['types', 'constants']);
const SLICED_LAYERS: ReadonlySet<string> = new Set(['pages', 'widgets', 'features', 'entities']);
const SLICE_SEGMENTS: ReadonlySet<string> = new Set(['model', 'api', 'ui', 'lib', 'config']);
const SHARED_SEGMENTS: ReadonlySet<string> = new Set(['config', 'lib', 'api', 'ui', 'types']);

type MessageId =
  'vagueSegment' | 'genericFileName' | 'unknownSliceSegment' | 'unknownSharedSegment';

// Returns the message id for an FSD segment violation in a src/ path, or null when the layout is valid.
function findSegmentViolation(segments: readonly string[]): MessageId | null {
  const [root, layer, slice, segment] = segments;
  if (root !== 'src' || layer === undefined) {
    return null;
  }
  if (SLICED_LAYERS.has(layer) && slice !== undefined && segment !== undefined) {
    const isSliceIndex = segments.length === 4 && segment === 'index.ts';
    const isKnownFolder = segments.length > 4 && SLICE_SEGMENTS.has(segment);
    return isSliceIndex || isKnownFolder ? null : 'unknownSliceSegment';
  }
  if (layer === 'shared' && slice !== undefined) {
    return segments.length > 3 && SHARED_SEGMENTS.has(slice) ? null : 'unknownSharedSegment';
  }
  return null;
}

export const noVagueFilename = createRule<[], MessageId>({
  name: 'no-vague-filename',
  meta: {
    type: 'suggestion',
    docs: { description: 'File and folder names state responsibility (convention 001, 003).' },
    schema: [],
    messages: {
      vagueSegment:
        '`{{ segment }}` is a banned vague file/folder name; name the responsibility, e.g. `plan-geodesic-route.ts` (convention 001).',
      genericFileName:
        '`{{ segment }}.ts` is too generic; name the content, e.g. `fire.types.ts` or `bc-bounding-box.ts` (convention 001).',
      unknownSliceSegment:
        'Inside a slice only `index.ts` and the segments model/, api/, ui/, lib/, config/ are allowed (convention 003).',
      unknownSharedSegment:
        'Inside src/shared only the segments config/, lib/, api/, ui/, types/ are allowed (convention 003).',
    },
  },
  create(context) {
    return {
      Program(node) {
        const relativePath = getRepoRelativePath(context.filename, context.cwd);
        const segments = relativePath.split('/');
        const fileName = segments.at(-1) ?? '';
        const baseName = fileName.split('.')[0] ?? '';
        const names = [...segments.slice(0, -1), baseName];
        for (const segment of names) {
          if (VAGUE_SEGMENTS.has(segment)) {
            context.report({ node, messageId: 'vagueSegment', data: { segment } });
          }
        }
        if (GENERIC_FILE_NAMES.has(baseName) && /^[a-z]+\.tsx?$/.test(fileName)) {
          context.report({ node, messageId: 'genericFileName', data: { segment: baseName } });
        }
        const violation = findSegmentViolation(segments);
        if (violation !== null) {
          context.report({ node, messageId: violation });
        }
      },
    };
  },
});
