// Reads the fire feed's cache entry for the current filter, so every view shows the same fires (behaviour §7).
import { useAppSelector } from '@/shared/lib/redux';

import { selectIsOutIncluded } from '../model/fire-filter.slice';
import { useGetActiveFiresQuery } from './fire.api';

export type FireFeedQueryOptions = {
  pollingInterval?: number;
  refetchOnReconnect?: boolean;
  skipPollingIfUnfocused?: boolean;
};

// Returns the feed query for the current filter; the previous fires stay in `data` while a new filter loads.
export function useFireFeedQuery(options: FireFeedQueryOptions = {}) {
  const isOutIncluded = useAppSelector(selectIsOutIncluded);
  return useGetActiveFiresQuery({ isOutIncluded }, options);
}
