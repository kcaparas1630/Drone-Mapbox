// Tests that vague binding names are rejected while property keys and longer names pass.
import { createRuleTester } from './create-rule-tester';
import { noVagueIdentifier } from './no-vague-identifier';

const ruleTester = createRuleTester();

ruleTester.run('no-vague-identifier', noVagueIdentifier, {
  valid: [
    'const fireData = 1;',
    'const { data: fires } = query;',
    'const total = response.data.length;',
    'const config = { data: 1, item: 2 };',
    'type Data = string;',
    'function loadItems(fireItems) { return fireItems; }',
  ],
  invalid: [
    { code: 'const data = 1;', errors: [{ messageId: 'vagueIdentifier' }] },
    { code: 'const { data } = query;', errors: [{ messageId: 'vagueIdentifier' }] },
    { code: 'function run(cb) { return cb; }', errors: [{ messageId: 'vagueIdentifier' }] },
    { code: 'const [item] = rows;', errors: [{ messageId: 'vagueIdentifier' }] },
    {
      code: 'try { run(); } catch (res) { report(res); }',
      errors: [{ messageId: 'vagueIdentifier' }],
    },
    { code: "import { handler } from './x';", errors: [{ messageId: 'vagueIdentifier' }] },
    { code: 'function callback() {}', errors: [{ messageId: 'vagueIdentifier' }] },
  ],
});
