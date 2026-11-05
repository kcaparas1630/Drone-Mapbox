// Finds pure modules without a sibling test, and tests that do not target their sibling (conventions 010, 013).

const PURE_MODULE_PATTERN = /^src\/(entities\/[^/]+\/(lib|model)|shared\/lib)\/.+\.tsx?$/;
const NOT_A_UNIT_PATTERN =
  /(^|\/)index\.tsx?$|\.types\.tsx?$|\.d\.ts$|\.test\.tsx?$|\.fixture\.tsx?$/;
const IMPORT_PATTERN = /^\s*import\s+(type\s+)?(?:[^'";]*?\s+from\s+)?['"](\.\/[^'"]+)['"]/gm;

// Returns the directory and the file name without its .ts/.tsx extension.
function splitModulePath(path: string): { directory: string; baseName: string } {
  const slashIndex = path.lastIndexOf('/');
  return {
    directory: path.slice(0, slashIndex + 1),
    baseName: path.slice(slashIndex + 1).replace(/\.tsx?$/, ''),
  };
}

// Returns problems with a test's imports: it must import ./<base> and no other sibling module by value.
function findTestImportProblems(testPath: string, baseName: string, testSource: string): string[] {
  const problems: string[] = [];
  let isTargetImported = false;
  for (const match of testSource.matchAll(IMPORT_PATTERN)) {
    const isTypeOnly = match[1] !== undefined;
    const specifier = match[2] ?? '';
    if (specifier === `./${baseName}`) {
      isTargetImported = true;
    } else if (!isTypeOnly && !/\.fixture(\.json)?$/.test(specifier)) {
      problems.push(`${testPath}: imports sibling ${specifier}; test only ./${baseName} here`);
    }
  }
  if (!isTargetImported) {
    problems.push(`${testPath}: must import the module under test from './${baseName}'`);
  }
  return problems;
}

// Returns one readable problem per pure module lacking a sibling test or per mis-targeted test.
export function findMissingSiblingTests(
  files: readonly string[],
  readFile: (path: string) => string,
): string[] {
  const fileSet = new Set(files);
  const problems: string[] = [];
  for (const path of files) {
    if (!PURE_MODULE_PATTERN.test(path) || NOT_A_UNIT_PATTERN.test(path)) {
      continue;
    }
    const { directory, baseName } = splitModulePath(path);
    const testPath = [`${directory}${baseName}.test.ts`, `${directory}${baseName}.test.tsx`].find(
      (candidate) => fileSet.has(candidate),
    );
    if (testPath === undefined) {
      problems.push(`${path}: add a sibling ${baseName}.test.ts (convention 010)`);
      continue;
    }
    problems.push(...findTestImportProblems(testPath, baseName, readFile(testPath)));
  }
  return problems;
}
