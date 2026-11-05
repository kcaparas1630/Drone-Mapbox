// Keyboard behaviour of the search combobox: arrows move, Enter flies, Escape clears then leaves the box.
import type { KeyboardEvent } from 'react';

import type { SearchOption } from './search.schema';

export type HandleSearchKeyControls = {
  options: SearchOption[];
  activeIndex: number;
  query: string;
  setIsOpen: (isOpen: boolean) => void;
  setActiveIndex: (index: number) => void;
  setQuery: (query: string) => void;
  blurInput: () => void;
  choose: (option: SearchOption | undefined) => Promise<void>;
};

// Applies the key to the combobox and prevents the default action for keys it handles.
export function handleSearchKey(
  event: KeyboardEvent<HTMLInputElement>,
  controls: HandleSearchKeyControls,
): void {
  const { options, activeIndex } = controls;
  switch (event.key) {
    case 'ArrowDown':
      controls.setIsOpen(true);
      controls.setActiveIndex(Math.min(activeIndex + 1, options.length - 1));
      break;
    case 'ArrowUp':
      controls.setActiveIndex(Math.max(activeIndex - 1, 0));
      break;
    case 'Enter':
      void controls.choose(options[activeIndex] ?? options[0]);
      break;
    case 'Escape':
      if (controls.query === '') {
        controls.blurInput();
      }
      controls.setQuery('');
      break;
    default:
      return;
  }
  event.preventDefault();
}
