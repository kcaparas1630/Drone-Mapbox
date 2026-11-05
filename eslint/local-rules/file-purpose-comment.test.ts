// Tests that each file opens with a single, well-formed one-line purpose comment.
import { createRuleTester } from './create-rule-tester';
import { filePurposeComment } from './file-purpose-comment';

const ruleTester = createRuleTester();

ruleTester.run('file-purpose-comment', filePurposeComment, {
  valid: [
    '// Fetches active wildfire points from the BCWS ArcGIS feed.\nexport {};',
    '// Public API of the fire entity.\n\n// Loads things.\nexport function loadFires() {}',
    '// A file with only a comment.',
    { code: 'declare const x: number;', filename: 'src/vite-env.d.ts' },
  ],
  invalid: [
    { code: 'export {};', errors: [{ messageId: 'missingFileComment' }] },
    { code: '/** Fetches fires. */\nexport {};', errors: [{ messageId: 'missingFileComment' }] },
    { code: '\n// Fetches fires.\nexport {};', errors: [{ messageId: 'missingFileComment' }] },
    { code: 'export {}; // Fetches fires.', errors: [{ messageId: 'missingFileComment' }] },
    { code: '// fetches fires.\nexport {};', errors: [{ messageId: 'notCapitalized' }] },
    { code: '// Fetches fires\nexport {};', errors: [{ messageId: 'missingPeriod' }] },
    {
      code: '// Fetches fires.\n// And formats them.\nexport {};',
      errors: [{ messageId: 'multiLineFileComment' }],
    },
  ],
});
