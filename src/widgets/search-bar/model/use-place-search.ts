// Debounced Search Box suggestions (300 ms, ≥ 2 chars, within budget), one session per search, stale requests aborted.
import { type SearchBoxCore, type SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core';
import { useEffect, useRef, useState } from 'react';

import type { Place } from '@/entities/route';
import { mapboxRequestBudgets } from '@/shared/api';
import { useOnlineStatus } from '@/shared/lib/browser';
import { useAppStore } from '@/shared/lib/redux';
import type { Result } from '@/shared/lib/result';

import { readSearchLimitMessage } from '../lib/read-search-limit-message';
import { createPlaceSearch } from './create-place-search';
import { readSearchErrorMessage } from './read-search-error-message';
import { resolvePlace, type ResolvePlaceProblem } from './resolve-place';
import { type SearchOption, searchSuggestionSchema } from './search.schema';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type SuggestState = { query: string; options: SearchOption[]; error: string | null };

export type UsePlaceSearchResult = {
  options: SearchOption[];
  error: string | null;
  isLoading: boolean;
  resolvePlace: (option: SearchOption) => Promise<Result<Place, ResolvePlaceProblem>>;
};

// Converts raw SDK suggestions into validated options, dropping malformed entries.
function toOptions(suggestions: SearchBoxSuggestion[]): SearchOption[] {
  return suggestions.flatMap((suggestion) => {
    const parsed = searchSuggestionSchema.safeParse(suggestion);
    if (!parsed.success) {
      return [];
    }
    const detail = parsed.data.place_formatted ?? parsed.data.full_address ?? '';
    return [{ id: parsed.data.mapbox_id, name: parsed.data.name, detail, suggestion, place: null }];
  });
}

// Returns suggestions for the query and a place resolver; the SDK client is created on first use.
export function usePlaceSearch(accessToken: string, query: string): UsePlaceSearchResult {
  const store = useAppStore();
  const isOnline = useOnlineStatus();
  const searchRef = useRef<SearchBoxCore | null>(null);
  const sessionRef = useRef<SessionToken | null>(null);
  const [state, setState] = useState<SuggestState>({ query: '', options: [], error: null });
  const trimmed = query.trim();
  const isSearchable = isOnline && trimmed.length >= MIN_QUERY_LENGTH;
  useEffect(() => {
    if (!isSearchable) {
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const reservation = mapboxRequestBudgets.searchSuggest.reserve();
      if (!reservation.isAllowed) {
        setState({
          query: trimmed,
          options: [],
          error: readSearchLimitMessage(reservation.exceededWindow),
        });
        return;
      }
      searchRef.current ??= createPlaceSearch(accessToken);
      sessionRef.current ??= new SessionToken();
      const snapshot = store.getState().droneSnapshot.snapshot;
      const options = { sessionToken: sessionRef.current, signal: controller.signal };
      const request = snapshot
        ? searchRef.current.suggest(trimmed, {
            ...options,
            proximity: [snapshot.lng, snapshot.lat],
          })
        : searchRef.current.suggest(trimmed, options);
      request
        .then((response) => {
          setState({ query: trimmed, options: toOptions(response.suggestions), error: null });
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setState({ query: trimmed, options: [], error: readSearchErrorMessage(error) });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [accessToken, isSearchable, store, trimmed]);
  const isCurrent = state.query === trimmed;
  return {
    options: isSearchable && isCurrent ? state.options : [],
    error: isSearchable && isCurrent ? state.error : null,
    isLoading: isSearchable && !isCurrent,
    resolvePlace: async (option) => {
      const result = await resolvePlace(searchRef.current, sessionRef.current, option);
      sessionRef.current = null;
      return result;
    },
  };
}
