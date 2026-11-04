// Tests the file-name classification behind the one-responsibility export rules.
import { describe, expect, it } from 'vitest';

import { getExportFileKind } from './get-export-file-kind';

describe('getExportFileKind', () => {
  it('exempts tests, specs, configs, setup and declaration files', () => {
    expect(getExportFileKind('src/a/b.test.tsx')).toBe('exempt');
    expect(getExportFileKind('e2e/app.spec.ts')).toBe('exempt');
    expect(getExportFileKind('vite.config.ts')).toBe('exempt');
    expect(getExportFileKind('vitest.setup.ts')).toBe('exempt');
    expect(getExportFileKind('src/vite-env.d.ts')).toBe('exempt');
  });

  it('recognises slice index files with either path separator', () => {
    expect(getExportFileKind('src\\entities\\fire\\index.ts')).toBe('index');
  });

  it('allows several exports in slice, api and schema files', () => {
    expect(getExportFileKind('drone-mode.slice.ts')).toBe('multiExport');
    expect(getExportFileKind('fire.api.ts')).toBe('multiExport');
    expect(getExportFileKind('fire.schema.ts')).toBe('multiExport');
  });

  it('marks type files and everything else', () => {
    expect(getExportFileKind('fire.types.ts')).toBe('typesOnly');
    expect(getExportFileKind('step-free-flight.ts')).toBe('singleExport');
  });
});
