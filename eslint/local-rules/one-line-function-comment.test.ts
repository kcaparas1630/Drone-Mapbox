// Tests the one-line comment requirement above functions and the ban on block comments.
import { createRuleTester } from './create-rule-tester';
import { oneLineFunctionComment } from './one-line-function-comment';

const ruleTester = createRuleTester();

ruleTester.run('one-line-function-comment', oneLineFunctionComment, {
  valid: [
    '// Loads the drone GLB and returns its scene group.\nexport function loadDroneModel() {}',
    '// Converts degrees to radians.\nconst toRadians = (deg) => deg;',
    '// Builds the layer.\nfunction buildLayer() {\n  // Draws one frame.\n  function render() {}\n}',
    'run(() => 1);\nconst layer = { render() { return 1; } };',
    'const limit = 3;',
    'class Layer {\n  render() { return 1; }\n}',
    'class Layer {\n  constructor() {\n    a();\n    b();\n  }\n}',
    '// Draws the scene each frame.\nexport default function render() {}',
  ],
  invalid: [
    {
      code: 'export function loadDroneModel() {}',
      errors: [{ messageId: 'missingFunctionComment' }],
    },
    {
      code: '// Loads the drone.\n\nfunction loadDrone() {}',
      errors: [{ messageId: 'missingFunctionComment' }],
    },
    {
      code: '// Loads the drone.\n// Reads it from a GLB file.\nfunction loadDrone() {}',
      errors: [{ messageId: 'multiLineFunctionComment' }],
    },
    {
      code: '// TODO(kent): speed this up.\nfunction loadDrone() {}',
      errors: [{ messageId: 'todoIsNotAPurpose' }],
    },
    {
      code: '/** Loads the drone. */\nfunction loadDrone() {}',
      errors: [{ messageId: 'blockComment' }, { messageId: 'missingFunctionComment' }],
    },
    {
      code: '// loads the drone.\nfunction loadDrone() {}',
      errors: [{ messageId: 'notCapitalized' }],
    },
    {
      code: 'export const stepWorld = () => 1;',
      errors: [{ messageId: 'missingFunctionComment' }],
    },
    {
      code: 'class Layer {\n  render() {\n    a();\n    b();\n  }\n}',
      errors: [{ messageId: 'missingFunctionComment' }],
    },
    { code: 'const x = 1; /* note */', errors: [{ messageId: 'blockComment' }] },
  ],
});
