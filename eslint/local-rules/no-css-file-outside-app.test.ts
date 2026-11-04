// Tests that .css imports are allowed only under src/app.
import { createRuleTester } from './create-rule-tester';
import { noCssFileOutsideApp } from './no-css-file-outside-app';

const ruleTester = createRuleTester();

ruleTester.run('no-css-file-outside-app', noCssFileOutsideApp, {
  valid: [
    { code: "import './styles/globals.css';", filename: 'src/app/main.tsx' },
    { code: "import 'mapbox-gl/dist/mapbox-gl.css';", filename: 'src/app/main.tsx' },
    { code: "import { x } from './x';", filename: 'src/widgets/hud/ui/hud.tsx' },
  ],
  invalid: [
    {
      code: "import './hud.css';",
      filename: 'src/widgets/hud/ui/hud.tsx',
      errors: [{ messageId: 'cssOutsideApp' }],
    },
    {
      code: "import styles from './hud.css?inline';",
      filename: 'src/widgets/hud/ui/hud.tsx',
      errors: [{ messageId: 'cssOutsideApp' }],
    },
    {
      code: "void import('./lazy.css');",
      filename: 'src/pages/map-page/ui/map-page.tsx',
      errors: [{ messageId: 'cssOutsideApp' }],
    },
  ],
});
