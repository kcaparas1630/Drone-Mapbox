// Owns the fire feed subscription: fetch on launch, poll every 10 min, refetch on reconnect (behaviour §7).
import { type Fire, useFireFeedQuery } from '@/entities/fire';
import { FIRE_FEED } from '@/shared/config';

// Returns the latest good fires (kept through failed polls), or undefined before the first success.
export function useActiveFireFeed(): readonly Fire[] | undefined {
  const { data: feed } = useFireFeedQuery({
    pollingInterval: FIRE_FEED.POLL_MS,
    refetchOnReconnect: true,
    skipPollingIfUnfocused: false,
  });
  return feed?.fires;
}
