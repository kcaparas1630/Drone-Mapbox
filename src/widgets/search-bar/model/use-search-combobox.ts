// Combobox state for the search bar: query, open list, keyboard selection, recents and flying on choice (§5).
import { type KeyboardEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

import { selectRecentPlaces } from '@/entities/route';
import { flyToPlace } from '@/features/fly-to-place';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { toRecentOptions } from '../lib/to-recent-options';
import { handleSearchKey } from './handle-search-key';
import type { SearchOption } from './search.schema';
import { usePlaceSearch } from './use-place-search';
import { useSearchShortcut } from './use-search-shortcut';

const MIN_QUERY_LENGTH = 2;

// Returns everything the search bar renders and the handlers it wires to the input.
export function useSearchCombobox(mapboxToken: string) {
  const dispatch = useAppDispatch();
  const recents = useAppSelector(selectRecentPlaces);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const search = usePlaceSearch(mapboxToken, query);
  useSearchShortcut(inputRef);
  const isShowingRecents = query.trim().length < MIN_QUERY_LENGTH;
  const options = isShowingRecents ? toRecentOptions(recents) : search.options;
  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };
  const choose = async (option: SearchOption | undefined) => {
    if (option === undefined) {
      return;
    }
    const result = await search.resolvePlace(option);
    if (!result.isOk) {
      const isOutside = result.error === 'outside-bc';
      toast.error(
        isOutside ? 'That place is outside British Columbia' : 'Could not load that place.',
      );
      return;
    }
    dispatch(flyToPlace(result.value));
    setQuery('');
    close();
    inputRef.current?.blur();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    handleSearchKey(event, {
      options,
      activeIndex,
      query,
      setIsOpen,
      setActiveIndex,
      setQuery,
      blurInput: () => inputRef.current?.blur(),
      choose,
    });
  };
  return {
    inputRef,
    query,
    setQuery,
    isOpen,
    setIsOpen,
    close,
    activeIndex,
    options,
    isShowingRecents,
    search,
    choose,
    handleKeyDown,
  };
}
