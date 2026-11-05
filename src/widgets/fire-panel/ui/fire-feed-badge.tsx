// Fire feed badge in the fire panel: "Fires: N · updated 4 min ago", amber/red when stale (§7, §7.1).
import { Flame } from 'lucide-react';

import { useFireFeedQuery } from '@/entities/fire';
import { useNow } from '@/shared/lib/browser';
import { Badge } from '@/shared/ui';

import { readFireFreshness } from '../lib/read-fire-freshness';

const MINUTE_MS = 60_000;
const BADGE_TONES = { neutral: 'neutral', warning: 'warning', danger: 'danger' } as const;

// Renders the badge from the shared feed cache, re-reading the age every minute.
export function FireFeedBadge() {
  const nowMs = useNow(MINUTE_MS);
  const { data: feed, isError } = useFireFeedQuery();
  const freshness = readFireFreshness({
    fireCount: feed?.fires.length ?? null,
    fetchedAtMs: feed?.fetchedAtMs ?? null,
    nowMs,
    isError,
  });
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-start gap-1">
      <Badge tone={BADGE_TONES[freshness.tone]} className="min-h-7 px-2.5">
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
