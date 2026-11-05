// Tests that function, method and module-level arrow names must start with an approved verb.
import { createRuleTester } from './create-rule-tester';
import { functionNameStartsWithVerb } from './function-name-starts-with-verb';

const ruleTester = createRuleTester();

ruleTester.run('function-name-starts-with-verb', functionNameStartsWithVerb, {
  valid: [
    'export function fetchBCWildfireData() {}',
    'function loadDroneModel() {}',
    'export const computeChaseCamera = () => 1;',
    'export function FirePopup() { return null; }',
    'export function useOnlineStatus() { return true; }',
    'const reducers = { x: 1 };',
    'createSlice({ reducers: { routePlanned(state) {} } });',
    'createApi({ endpoints: (build) => ({ getFires: build.query({ queryFn() {} }) }) });',
    'function run() { const thing = () => 1; return thing; }',
    'class Layer { constructor() {} render() {} get size() { return 1; } }',
    'const layer = { onAdd() {}, onRemove() {}, render() {} };',
    { code: 'const layer = { prerender() {} };', options: [{ allowedNames: ['prerender'] }] },
    { code: 'export function cn() {}', options: [{ allowedNames: ['cn'] }] },
    'const layer = { ["computed"]() {}, "quoted-key"() {} };',
  ],
  invalid: [
    { code: 'function droneThing() {}', errors: [{ messageId: 'missingVerb' }] },
    {
      code: 'export function getData2() {} function main() {}',
      errors: [{ messageId: 'missingVerb' }],
    },
    { code: 'export const stepper = () => 1;', errors: [{ messageId: 'missingVerb' }] },
    { code: 'const thing = function () {};', errors: [{ messageId: 'missingVerb' }] },
    { code: 'class Layer { tokenize() {} }', errors: [{ messageId: 'missingVerb' }] },
    { code: 'const layer = { prerender() {} };', errors: [{ messageId: 'missingVerb' }] },
    {
      code: 'export function buildLayer() { return { thing: () => 1 }; }',
      errors: [{ messageId: 'missingVerb' }],
    },
  ],
});
