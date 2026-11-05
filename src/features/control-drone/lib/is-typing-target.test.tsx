// Tests which focused elements suspend drone keyboard input.
import { describe, expect, it } from 'vitest';

import { isTypingTarget } from './is-typing-target';

describe('isTypingTarget', () => {
  it('treats text inputs, textareas and contenteditable as typing targets', () => {
    const search = document.createElement('input');
    search.type = 'search';
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    expect(isTypingTarget(search)).toBe(true);
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true);
    expect(isTypingTarget(editable)).toBe(true);
  });

  it('lets buttons, checkboxes, the body and null through', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    expect(isTypingTarget(checkbox)).toBe(false);
    expect(isTypingTarget(document.createElement('button'))).toBe(false);
    expect(isTypingTarget(document.body)).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
