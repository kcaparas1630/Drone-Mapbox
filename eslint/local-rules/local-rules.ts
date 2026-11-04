// Local ESLint plugin holding the convention rules no published rule covers (conventions 001-013).
import type { ESLint } from 'eslint';

import { filePurposeComment } from './file-purpose-comment';
import { functionNameStartsWithVerb } from './function-name-starts-with-verb';
import { noVagueFilename } from './no-vague-filename';
import { noVagueIdentifier } from './no-vague-identifier';
import { oneLineFunctionComment } from './one-line-function-comment';
import { oneValueExportPerFile } from './one-value-export-per-file';
import { relatedTypeExportsOnly } from './related-type-exports-only';

const LOCAL_RULE_MODULES = {
  'file-purpose-comment': filePurposeComment,
  'function-name-starts-with-verb': functionNameStartsWithVerb,
  'no-vague-filename': noVagueFilename,
  'no-vague-identifier': noVagueIdentifier,
  'one-line-function-comment': oneLineFunctionComment,
  'one-value-export-per-file': oneValueExportPerFile,
  'related-type-exports-only': relatedTypeExportsOnly,
};

export const localRules: ESLint.Plugin = {
  meta: { name: 'local', version: '1.0.0' },
  // typescript-eslint rule types predate ESLint 10's RuleDefinition type; the runtime shape is identical.
  rules: LOCAL_RULE_MODULES as unknown as NonNullable<ESLint.Plugin['rules']>,
};
