// Owns the fire feed subscription: fetch on launch, poll every 10 min, refetch on reconnect (behaviour §7).
import { type Fire, useGetActiveFiresQuery } from '@/entities/fire';
import { FIRE_FEED } from '@/shared/config';

const FIRE_QUERY_ARGS = { isOutIncluded: false };

// Returns the latest good fires (kept through failed polls), or undefined before the first success.
export function useActiveFireFeed(): readonly Fire[] | undefined {
  const { data: feed } = useGetActiveFiresQuery(FIRE_QUERY_ARGS, {
    pollingInterval: FIRE_FEED.POLL_MS,
    refetchOnReconnect: true,
    skipPollingIfUnfocused: false,
  });
  return feed?.fires;
}
