// Marker rule for to-do notes: each must name an owner as `TO` + `DO(owner): text` (convention 002).
import type { MarkerRule } from './convention-check.types';

const WORD = ['TO', 'DO'].join('');

export const TODO_MARKER_RULE: MarkerRule = {
  marker: new RegExp(String.raw`//\s*${WORD}\b`),
  isWellFormed: (line) => new RegExp(String.raw`\b${WORD}\([^)\s]+\):\s*\S`).test(line),
  fixHint: `name an owner: ${WORD}(owner): what is left to do (convention 002)`,
};
