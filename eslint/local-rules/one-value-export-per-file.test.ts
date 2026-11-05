// Tests one value export per file, file-name matching and re-export-only index files.
import { createRuleTester } from './create-rule-tester';
import { oneValueExportPerFile } from './one-value-export-per-file';

const ruleTester = createRuleTester();

ruleTester.run('one-value-export-per-file', oneValueExportPerFile, {
  valid: [
    {
      code: 'export function planGeodesicRoute() {}',
      filename: 'src/entities/route/lib/plan-geodesic-route.ts',
    },
    {
      code: 'export function createSimWorld() {}\nexport type SimWorld = {};',
      filename: 'src/entities/drone/model/sim-world.ts',
    },
    {
      code: 'export const BC_BOUNDING_BOX = {};',
      filename: 'src/shared/config/bc-bounding-box.ts',
    },
    {
      code: 'export function FirePopup() { return null; }',
      filename: 'src/widgets/fire-popup/ui/fire-popup.tsx',
    },
    { code: 'export type Result<T> = { value: T };', filename: 'src/shared/lib/result.ts' },
    { code: 'run();', filename: 'scripts/stop-hook.ts' },
    {
      code: "export { FirePopup } from './ui/fire-popup';\nexport type { FirePopupProps } from './ui/fire-popup';\nexport * from './x';",
      filename: 'src/widgets/fire-popup/index.ts',
    },
    { code: 'export {};', filename: 'src/entities/fire/index.ts' },
    {
      code: 'export const fireSlice = 1;\nexport const fireSelected = 2;',
      filename: 'src/entities/fire/model/selected-fire.slice.ts',
    },
    {
      code: 'export const a = 1;\nexport const b = 2;',
      filename: 'src/entities/fire/lib/x.test.ts',
    },
    {
      code: 'export function MapPage() { return null; }\nexport default MapPage;',
      filename: 'src/pages/map-page/ui/map-page.tsx',
    },
    { code: 'export type FireStatus = string;', filename: 'src/entities/fire/model/fire.types.ts' },
    { code: 'export default {};', filename: 'vite.config.ts' },
  ],
  invalid: [
    {
      code: 'export function formatSpeed() {}\nexport function formatAltitude() {}',
      filename: 'src/widgets/hud/lib/format-speed.ts',
      errors: [{ messageId: 'tooManyValueExports' }],
    },
    {
      code: 'export function formatSpeed() {}',
      filename: 'src/widgets/hud/ui/hud.tsx',
      errors: [{ messageId: 'nameMismatch' }],
    },
    {
      code: "import { x } from './x';\nexport const y = x;",
      filename: 'src/entities/fire/index.ts',
      errors: [{ messageId: 'indexOnlyReexports' }, { messageId: 'indexOnlyReexports' }],
    },
    {
      code: 'export const FIRE_STATUSES = [];',
      filename: 'src/entities/fire/model/fire.types.ts',
      errors: [{ messageId: 'valueInTypesFile' }],
    },
    {
      code: 'export function MapPage() { return null; }\nexport default MapPage;',
      filename: 'src/widgets/map-view/ui/map-page.tsx',
      errors: [{ messageId: 'tooManyValueExports' }],
    },
    {
      code: "export { loadFires } from './load-fires';\nexport function saveFires() {}",
      filename: 'src/entities/fire/api/save-fires.ts',
      errors: [{ messageId: 'nameMismatch' }, { messageId: 'tooManyValueExports' }],
    },
  ],
});
