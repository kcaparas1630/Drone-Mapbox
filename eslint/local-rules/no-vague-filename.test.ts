// Tests vague file names, generic names and FSD segment names across POSIX and Windows paths.
import { createRuleTester } from './create-rule-tester';
import { noVagueFilename } from './no-vague-filename';

const ruleTester = createRuleTester();
const CODE = 'export {};';

ruleTester.run('no-vague-filename', noVagueFilename, {
  valid: [
    { code: CODE, filename: 'src/entities/fire/model/fire.schema.ts' },
    { code: CODE, filename: 'src/entities/fire/index.ts' },
    { code: CODE, filename: 'src/entities/drone/lib/step-free-flight.test.ts' },
    { code: CODE, filename: 'src/shared/lib/geo/compute-initial-bearing.ts' },
    { code: CODE, filename: 'src/shared/types/fire-status.types.ts' },
    { code: CODE, filename: 'src/app/styles/globals.ts' },
    { code: CODE, filename: 'eslint/local-rules/no-vague-filename.ts' },
    { code: CODE, filename: 'src\\widgets\\hud\\ui\\hud.tsx' },
  ],
  invalid: [
    { code: CODE, filename: 'src/shared/lib/utils.ts', errors: [{ messageId: 'vagueSegment' }] },
    {
      code: CODE,
      filename: 'src/entities/drone/lib/helpers/step.ts',
      errors: [{ messageId: 'vagueSegment' }],
    },
    { code: CODE, filename: 'scripts/data/x.ts', errors: [{ messageId: 'vagueSegment' }] },
    {
      code: CODE,
      filename: 'src/entities/fire/model/types.ts',
      errors: [{ messageId: 'genericFileName' }],
    },
    {
      code: CODE,
      filename: 'src/widgets/hud/components/badge.tsx',
      errors: [{ messageId: 'unknownSliceSegment' }],
    },
    {
      code: CODE,
      filename: 'src/features/select-fire/select-fire.ts',
      errors: [{ messageId: 'unknownSliceSegment' }],
    },
    {
      code: CODE,
      filename: 'src/shared/hooks/use-x.ts',
      errors: [{ messageId: 'unknownSharedSegment' }],
    },
    {
      code: CODE,
      filename: 'src\\shared\\constants.ts',
      errors: [{ messageId: 'genericFileName' }, { messageId: 'unknownSharedSegment' }],
    },
  ],
});
