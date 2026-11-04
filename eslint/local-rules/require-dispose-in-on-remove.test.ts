// Tests that onAdd objects and classes must dispose resources in onRemove.
import { createRuleTester } from './create-rule-tester';
import { requireDisposeInOnRemove } from './require-dispose-in-on-remove';

const ruleTester = createRuleTester();

ruleTester.run('require-dispose-in-on-remove', requireDisposeInOnRemove, {
  valid: [
    'const layer = { onAdd() {}, onRemove() { renderer.dispose(); } };',
    'const layer = { onAdd() {}, onRemove: () => { if (mesh) { mesh.geometry.dispose(); } } };',
    'const layer = { onAdd() {}, onRemove() { disposeDroneLayer(scene); } };',
    'class Layer { onAdd() {} onRemove() { this.disposeScene(); } }',
    'const config = { onRemove() {} };',
  ],
  invalid: [
    { code: 'const layer = { onAdd() {} };', errors: [{ messageId: 'missingOnRemove' }] },
    {
      code: 'const layer = { onAdd() {}, onRemove() { scene.clear(); } };',
      errors: [{ messageId: 'missingDispose' }],
    },
    { code: 'class Layer { onAdd() {} onRemove() {} }', errors: [{ messageId: 'missingDispose' }] },
  ],
});
