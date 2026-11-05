// Fire feed badge: "Fires: N · updated 4 min ago", amber/red when stale, "unavailable" when failing (§7).
import { Flame } from 'lucide-react';

import { useGetActiveFiresQuery } from '@/entities/fire';
import { useNow } from '@/shared/lib/browser';
import { Badge } from '@/shared/ui';

import { readFireFreshness } from '../lib/read-fire-freshness';

const FIRE_QUERY_ARGS = { isOutIncluded: false };
const MINUTE_MS = 60_000;
const BADGE_TONES = { neutral: 'neutral', warning: 'warning', danger: 'danger' } as const;

// Renders the badge from the shared feed cache, re-reading the age every minute.
export function FireFeedBadge() {
  const nowMs = useNow(MINUTE_MS);
  const { data: feed, isError } = useGetActiveFiresQuery(FIRE_QUERY_ARGS);
  const freshness = readFireFreshness({
    fireCount: feed?.fires.length ?? null,
    fetchedAtMs: feed?.fetchedAtMs ?? null,
    nowMs,
    isError,
  });
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-end gap-1">
      <Badge tone={BADGE_TONES[freshness.tone]} className="min-h-8 px-3">
        <Flame aria-hidden="true" className="size-3.5" />
        {freshness.label}
      </Badge>
      {freshness.detail === null ? null : (
        <span className="rounded bg-panel px-2 py-0.5 text-[11px] text-warning">
          {freshness.detail}
        </span>
      )}
    </div>
  );
}
