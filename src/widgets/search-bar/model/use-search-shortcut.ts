// Focuses the search box with "/" or Ctrl+K from anywhere outside a text field (behaviour §3.1).
import { type RefObject, useEffect } from 'react';

// Returns true while the user is typing into some other text field.
function isTypingElsewhere(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

// Registers the shortcut for the component's lifetime.
export function useSearchShortcut(inputRef: RefObject<HTMLInputElement | null>): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSlash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey;
      const isCommandK = event.code === 'KeyK' && (event.ctrlKey || event.metaKey);
      if ((!isSlash && !isCommandK) || isTypingElsewhere(event.target)) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);
}
