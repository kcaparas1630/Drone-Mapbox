// Tests that only src/shared/api may call the global fetch.
import { createRuleTester } from './create-rule-tester';
import { fetchThroughSharedApi } from './fetch-through-shared-api';

const ruleTester = createRuleTester();
const FEATURE_FILE = 'src/entities/fire/api/fetch-active-fires.ts';

ruleTester.run('fetch-through-shared-api', fetchThroughSharedApi, {
  valid: [
    { code: 'void fetch(url);', filename: 'src/shared/api/fetch-json.ts' },
    { code: "import { fetch } from './x';\nvoid fetch(url);", filename: FEATURE_FILE },
    { code: 'function load(fetch) { return fetch(url); }', filename: FEATURE_FILE },
    { code: 'void api.fetch(url);', filename: FEATURE_FILE },
    { code: 'void fetch(url);', filename: 'scripts/stop-hook.ts' },
  ],
  invalid: [
    { code: 'void fetch(url);', filename: FEATURE_FILE, errors: [{ messageId: 'globalFetch' }] },
    {
      code: 'void window.fetch(url);',
      filename: FEATURE_FILE,
      errors: [{ messageId: 'globalFetch' }],
    },
    {
      code: 'void globalThis.fetch(url);',
      filename: FEATURE_FILE,
      errors: [{ messageId: 'globalFetch' }],
    },
    {
      code: 'async function loadFires() { return await fetch(url); }',
      filename: 'src\\widgets\\hud\\ui\\hud.tsx',
      errors: [{ messageId: 'globalFetch' }],
    },
  ],
});
