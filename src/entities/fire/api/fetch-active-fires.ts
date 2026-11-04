// Fetches every page of the BCWS feed through fetchJson (≤ 10 pages), then normalises it (ADR 003, behaviour §7).
import { FIRE_FEED } from '@/shared/config';
import { type FetchJsonError, fetchJson } from '@/shared/api';
import type { Result } from '@/shared/lib/result';
import { reportError } from '@/shared/lib/report-error';

import { normalizeFireFeatures } from '../lib/normalize-fire-features';
import { type FireFeature, fireFeedPageSchema } from '../model/fire.schema';
import type { FireFeedSnapshot } from '../model/fire.types';
import { buildFireQueryUrl } from './build-fire-query-url';

// Returns the normalised fires of all pages, or the first page error; drops and duplicates are warned.
export async function fetchActiveFires(
  isOutIncluded: boolean,
  signal: AbortSignal | undefined,
): Promise<Result<FireFeedSnapshot, FetchJsonError>> {
  const features: FireFeature[] = [];
  let isTruncated = false;
  for (let page = 0; page < FIRE_FEED.MAX_PAGES; page += 1) {
    const url = buildFireQueryUrl(page * FIRE_FEED.PAGE_SIZE, isOutIncluded);
    const result = await fetchJson(url, fireFeedPageSchema, {
      signal,
      timeoutMs: FIRE_FEED.TIMEOUT_MS,
      maxBytes: FIRE_FEED.MAX_BYTES,
    });
    if (!result.isOk) {
      return result;
    }
    features.push(...result.value.features);
    const hasMore = result.value.properties?.exceededTransferLimit === true;
    if (!hasMore) {
      break;
    }
    isTruncated = page === FIRE_FEED.MAX_PAGES - 1;
  }
  const { fires, droppedCount, duplicateCount } = normalizeFireFeatures(features);
  if (droppedCount > 0 || duplicateCount > 0 || isTruncated) {
    const summary = `${String(droppedCount)} dropped, ${String(duplicateCount)} duplicates`;
    reportError(isTruncated ? `${summary}, truncated at 10 pages` : summary, 'fire feed', 'warn');
  }
  return {
    isOk: true,
    value: { fires, fetchedAtMs: Date.now(), droppedCount, duplicateCount, isTruncated },
  };
}
