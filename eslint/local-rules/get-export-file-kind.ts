// Classifies a file by the export shape convention 013 allows for it.

export type ExportFileKind = 'exempt' | 'index' | 'multiExport' | 'typesOnly' | 'singleExport';

const EXEMPT_PATTERN = /(\.test\.tsx?|\.spec\.ts|\.config\.[cm]?[jt]s|\.d\.ts|\.setup\.ts)$/;
const MULTI_EXPORT_PATTERN = /\.(slice|api|schema)\.tsx?$/;

// Returns how many value exports the file may have, judged from its file name alone.
export function getExportFileKind(filename: string): ExportFileKind {
  const fileName = filename.replaceAll('\\', '/').split('/').at(-1) ?? '';
  if (EXEMPT_PATTERN.test(fileName)) {
    return 'exempt';
  }
  if (fileName === 'index.ts' || fileName === 'index.tsx') {
    return 'index';
  }
  if (MULTI_EXPORT_PATTERN.test(fileName)) {
    return 'multiExport';
  }
  if (/\.types\.tsx?$/.test(fileName)) {
    return 'typesOnly';
  }
  return 'singleExport';
}
