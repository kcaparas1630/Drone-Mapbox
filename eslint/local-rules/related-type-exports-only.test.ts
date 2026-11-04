// Tests that exported types must relate to the file's value export or the file name.
import { createRuleTester } from './create-rule-tester';
import { relatedTypeExportsOnly } from './related-type-exports-only';

const ruleTester = createRuleTester();

ruleTester.run('related-type-exports-only', relatedTypeExportsOnly, {
  valid: [
    {
      code: 'export function FirePopup() { return null; }\nexport type FirePopupProps = {};',
      filename: 'src/widgets/fire-popup/ui/fire-popup.tsx',
    },
    {
      code: 'export const fireSchema = 1;\nexport type Fire = {};\nexport type FireStatus = string;',
      filename: 'src/entities/fire/model/fire.schema.ts',
    },
    {
      code: 'export function createSimWorld() {}\nexport type SimWorld = {};',
      filename: 'src/entities/drone/model/sim-world.ts',
    },
    {
      code: 'export function buildRestrictedImports() {}\nexport type RestrictedImportsOptions = {};',
      filename: 'eslint/config/build-restricted-imports.ts',
    },
    { code: 'export type Result<T> = { value: T };', filename: 'src/shared/lib/result.ts' },
    {
      code: 'export const droneModeSlice = 1;\nexport type DroneModeState = {};',
      filename: 'src/entities/drone/model/drone-mode.slice.ts',
    },
    { code: 'export type HudData = {};', filename: 'src/widgets/hud/model/hud.types.ts' },
  ],
  invalid: [
    {
      code: 'export function formatSpeed() {}\nexport type HudData = {};',
      filename: 'src/widgets/hud/lib/format-speed.ts',
      errors: [{ messageId: 'unrelatedType' }],
    },
    {
      code: 'export type Result<T> = { value: T };\nexport type Fire = {};',
      filename: 'src/shared/lib/result.ts',
      errors: [{ messageId: 'unrelatedType' }],
    },
    {
      code: 'export const droneModeSlice = 1;\nexport type RouteState = {};',
      filename: 'src/entities/drone/model/drone-mode.slice.ts',
      errors: [{ messageId: 'unrelatedType' }],
    },
  ],
});
