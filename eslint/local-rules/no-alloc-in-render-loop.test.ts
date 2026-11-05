// Tests the allocation ban inside per-frame functions of the render-loop paths.
import { createRuleTester } from './create-rule-tester';
import { noAllocInRenderLoop } from './no-alloc-in-render-loop';

const ruleTester = createRuleTester();
const LOOP_FILE = 'src/widgets/map-view/model/run-frame-loop.ts';
const ENTITY_FILE = 'src/entities/drone/lib/step-free-flight.ts';

ruleTester.run('no-alloc-in-render-loop', noAllocInRenderLoop, {
  valid: [
    {
      code: 'const scratch = new Vector3();\nfunction stepWorld(world) { scratch.set(world.x, 0, 0); }',
      filename: LOOP_FILE,
    },
    {
      code: 'function stepWorld({ x }) { const [a, b] = pair; return a + b + x; }',
      filename: LOOP_FILE,
    },
    {
      code: 'function stepper() { return [1]; }\nfunction updater() { return {}; }',
      filename: LOOP_FILE,
    },
    {
      code: 'function buildLayer() { return { id: 1, render() { draw(); } }; }',
      filename: LOOP_FILE,
    },
    {
      code: 'function stepWorld() { return [1]; }',
      filename: 'src/widgets/hud/model/step-world.ts',
    },
    {
      code: 'function stepWorld() { return [1]; }',
      filename: 'src/widgets/map-view/model/step-world.test.ts',
    },
    {
      code: 'function stepWorld() { return [1]; }',
      filename: 'src/entities/fire/lib/step-world.ts',
    },
  ],
  invalid: [
    {
      code: 'export function stepProbe() { const v = new Vector3(); return [v].map((x) => x); }',
      filename: LOOP_FILE,
      errors: [
        { messageId: 'allocation' },
        { messageId: 'allocation' },
        { messageId: 'allocation' },
        { messageId: 'allocation' },
      ],
    },
    {
      code: 'const layer = { render(gl, matrix) { draw({ matrix }); } };',
      filename: LOOP_FILE,
      errors: [{ messageId: 'allocation' }],
    },
    {
      code: 'class Layer { prerender() { const c = mapboxgl.MercatorCoordinate.fromLngLat(p); } }',
      filename: LOOP_FILE,
      errors: [{ messageId: 'allocation' }],
    },
    {
      code: 'const applyAltitude = (world) => { world.samples = samples.slice(0); return { ...world }; };',
      filename: ENTITY_FILE,
      errors: [
        { messageId: 'allocation' },
        { messageId: 'allocation' },
        { messageId: 'allocation' },
      ],
    },
    {
      code: 'function sampleTerrain(map) { return map.queryTerrainElevation([1, 2]); }',
      filename: 'src\\entities\\terrain\\api\\sample-terrain.ts',
      errors: [{ messageId: 'allocation' }],
    },
    {
      code: 'function tick() { items.filter(isLive); }',
      filename: 'src/entities/route/lib/tick.ts',
      errors: [{ messageId: 'allocation' }],
    },
  ],
});
