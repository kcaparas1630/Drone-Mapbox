// Local ESLint plugin holding the convention rules no published rule covers (conventions 001-013).
import type { ESLint } from 'eslint';

import { filePurposeComment } from './file-purpose-comment';
import { functionNameStartsWithVerb } from './function-name-starts-with-verb';
import { noAllocInRenderLoop } from './no-alloc-in-render-loop';
import { noVagueFilename } from './no-vague-filename';
import { noVagueIdentifier } from './no-vague-identifier';
import { oneLineFunctionComment } from './one-line-function-comment';
import { oneValueExportPerFile } from './one-value-export-per-file';
import { reduxActionPastTense } from './redux-action-past-tense';
import { relatedTypeExportsOnly } from './related-type-exports-only';
import { requireDisposeInOnRemove } from './require-dispose-in-on-remove';

const LOCAL_RULE_MODULES = {
  'file-purpose-comment': filePurposeComment,
  'function-name-starts-with-verb': functionNameStartsWithVerb,
  'no-alloc-in-render-loop': noAllocInRenderLoop,
  'no-vague-filename': noVagueFilename,
  'no-vague-identifier': noVagueIdentifier,
  'one-line-function-comment': oneLineFunctionComment,
  'one-value-export-per-file': oneValueExportPerFile,
  'redux-action-past-tense': reduxActionPastTense,
  'related-type-exports-only': relatedTypeExportsOnly,
  'require-dispose-in-on-remove': requireDisposeInOnRemove,
};

export const localRules: ESLint.Plugin = {
  meta: { name: 'local', version: '1.0.0' },
  // typescript-eslint rule types predate ESLint 10's RuleDefinition type; the runtime shape is identical.
  rules: LOCAL_RULE_MODULES as unknown as NonNullable<ESLint.Plugin['rules']>,
};
