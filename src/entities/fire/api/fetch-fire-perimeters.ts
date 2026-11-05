// Fetches the BCWS fire perimeters through fetchJson and normalises them (ADR 023, behaviour §7).
import { type FetchJsonError, fetchJson } from '@/shared/api';
import { FIRE_FEED } from '@/shared/config';
import type { Result } from '@/shared/lib/result';

import { normalizeFirePerimeters } from '../lib/normalize-fire-perimeters';
import { firePerimeterPageSchema } from '../model/fire-perimeter.schema';
import type { FirePerimeter } from '../model/fire.types';
import { buildPerimeterQueryUrl } from './build-perimeter-query-url';

// Returns every usable non-Out perimeter, or the request error.
export async function fetchFirePerimeters(
  signal: AbortSignal | undefined,
): Promise<Result<FirePerimeter[], FetchJsonError>> {
  const result = await fetchJson(buildPerimeterQueryUrl(), firePerimeterPageSchema, {
    signal,
    timeoutMs: FIRE_FEED.TIMEOUT_MS,
    maxBytes: FIRE_FEED.PERIMETER_MAX_BYTES,
  });
  return result.isOk
    ? { isOk: true, value: normalizeFirePerimeters(result.value.features) }
    : result;
}
