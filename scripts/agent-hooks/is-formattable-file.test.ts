// Tests which edited files the format hook touches.
import { describe, expect, it } from 'vitest';

import { isFormattableFile } from './is-formattable-file';

describe('isFormattableFile', () => {
  it('accepts source, style, markdown and json files on Windows and POSIX paths', () => {
    for (const fileName of ['a.ts', 'b.tsx', 'c.css', 'd.md', 'e.json']) {
      expect(isFormattableFile(`C:\\repo\\src\\${fileName}`)).toBe(true);
      expect(isFormattableFile(`/repo/src/${fileName}`)).toBe(true);
    }
  });

  it('rejects other extensions and anything under node_modules', () => {
    expect(isFormattableFile('/repo/public/models/drone.glb')).toBe(false);
    expect(isFormattableFile('C:\\repo\\node_modules\\x\\index.ts')).toBe(false);
  });
});
