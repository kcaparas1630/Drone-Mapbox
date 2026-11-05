// Search bar: type a BC place, pick a suggestion or a recent place, and the drone flies there (ADR 008, 019).
import { useId, useState } from 'react';

import { useOnlineStatus } from '@/shared/lib/browser';

import { useSearchCombobox } from '../model/use-search-combobox';
import { SearchOpenButton } from './search-open-button';
import { SearchOptionsList } from './search-options-list';

// isCollapsible: shows a search icon until tapped, and folds back when the box loses focus (phone portrait, §4.2).
export type SearchBarProps = { mapboxToken: string; isCollapsible?: boolean };

// Returns the hint shown when the list has nothing to offer.
function readEmptyMessage(
  isOnline: boolean,
  isShowingRecents: boolean,
  isLoading: boolean,
): string {
  if (!isOnline) {
    return 'Offline — search needs a connection. Recent places appear here.';
  }
  if (isShowingRecents) {
    return 'Type a BC town, park or address.';
  }
  return isLoading ? 'Searching…' : 'No places found in British Columbia.';
}

// Renders the combobox input, its options and inline errors, or the search icon while collapsed.
export function SearchBar({ mapboxToken, isCollapsible = false }: SearchBarProps) {
  const listId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const isOnline = useOnlineStatus();
  const combobox = useSearchCombobox(mapboxToken);
  const { inputRef, query, isOpen, activeIndex, options, search } = combobox;
  const activeOptionId = activeIndex >= 0 ? `${listId}-${String(activeIndex)}` : undefined;
  const expand = () => {
    setIsExpanded(true);
  };
  if (isCollapsible && !isExpanded) {
    return <SearchOpenButton onOpen={expand} />;
  }
  return (
    <div role="search" className="w-full max-w-md">
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Search places in British Columbia"
        aria-expanded={isOpen && options.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        autoComplete="off"
        placeholder={isOnline ? 'Search a place in BC   ( / )' : 'Offline — recent places only'}
        value={query}
        className="min-h-11 w-full rounded-panel border border-panel-border bg-panel px-4 text-sm text-foreground shadow-lg backdrop-blur-md placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onChange={(event) => {
          combobox.setQuery(event.target.value);
          combobox.setIsOpen(true);
        }}
        onFocus={() => {
          combobox.setIsOpen(true);
        }}
        autoFocus={isCollapsible}
        onBlur={() => {
          combobox.close();
          setIsExpanded(false);
        }}
        onKeyDown={combobox.handleKeyDown}
      />
      {isOpen ? (
        <SearchOptionsList
          listId={listId}
          options={options}
          activeIndex={activeIndex}
          emptyMessage={readEmptyMessage(isOnline, combobox.isShowingRecents, search.isLoading)}
          onChoose={(option) => void combobox.choose(option)}
        />
      ) : null}
      {search.error === null ? null : (
        <p role="alert" className="mt-1 text-xs text-warning">
          {search.error}
        </p>
      )}
    </div>
  );
}
