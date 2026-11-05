// Tests detection of pure modules without sibling tests and of tests that target the wrong module.
import { describe, expect, it } from 'vitest';

import { findMissingSiblingTests } from './find-missing-sibling-tests';

const LIB = 'src/entities/drone/lib';

// Builds a file reader over an in-memory map of test sources.
function buildReader(sources: Record<string, string>): (path: string) => string {
  return (path) => sources[path] ?? '';
}

describe('findMissingSiblingTests', () => {
  it('passes a pure module whose sibling test imports it', () => {
    const files = [`${LIB}/step-free-flight.ts`, `${LIB}/step-free-flight.test.ts`];
    const reader = buildReader({
      [`${LIB}/step-free-flight.test.ts`]:
        "import { stepFreeFlight } from './step-free-flight';\nimport { createSimWorld } from '../model/sim-world';",
    });
    expect(findMissingSiblingTests(files, reader)).toEqual([]);
  });

  it('reports a pure module without a test', () => {
    const problems = findMissingSiblingTests(['src/shared/lib/report-error.ts'], buildReader({}));
    expect(problems).toEqual([
      'src/shared/lib/report-error.ts: add a sibling report-error.test.ts (convention 010)',
    ]);
  });

  it('ignores index, types, fixtures and files outside the pure paths', () => {
    const files = [
      'src/entities/fire/model/index.ts',
      'src/entities/fire/model/fire.types.ts',
      'src/entities/fire/model/fires.fixture.ts',
      'src/widgets/hud/ui/hud.tsx',
      'src/entities/fire/api/fire.api.ts',
    ];
    expect(findMissingSiblingTests(files, buildReader({}))).toEqual([]);
  });

  it('accepts a .test.tsx sibling for hook modules', () => {
    const files = [
      'src/shared/lib/use-online-status.ts',
      'src/shared/lib/use-online-status.test.tsx',
    ];
    const reader = buildReader({
      'src/shared/lib/use-online-status.test.tsx':
        "import { useOnlineStatus } from './use-online-status';",
    });
    expect(findMissingSiblingTests(files, reader)).toEqual([]);
  });

  it('reports a test that does not import its module or imports another sibling', () => {
    const files = [`${LIB}/a.ts`, `${LIB}/a.test.ts`, `${LIB}/b.ts`, `${LIB}/b.test.ts`];
    const reader = buildReader({
      [`${LIB}/a.test.ts`]: "import { b } from './b';\nimport type { B } from './b';",
      [`${LIB}/b.test.ts`]:
        "import { b } from './b';\nimport { scenario } from './flights.fixture';",
    });
    expect(findMissingSiblingTests(files, reader)).toEqual([
      `${LIB}/a.test.ts: imports sibling ./b; test only ./a here`,
      `${LIB}/a.test.ts: must import the module under test from './a'`,
    ]);
  });
});
