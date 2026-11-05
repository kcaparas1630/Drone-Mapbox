// Turns a Search Box retrieve response into a Place, rejecting bad shapes and places outside BC (§5.3).
import type { Place } from '@/entities/route';
import { BC_BOUNDING_BOX } from '@/shared/config';
import { isInsideBoundingBox } from '@/shared/lib/geo';
import type { Result } from '@/shared/lib/result';

import { searchRetrieveResponseSchema } from '../model/search.schema';

export type RetrievedPlaceProblem = 'invalid' | 'outside-bc';

// Returns the first feature as a Place when it is valid and inside British Columbia.
export function toRetrievedPlace(response: unknown): Result<Place, RetrievedPlaceProblem> {
  const parsed = searchRetrieveResponseSchema.safeParse(response);
  const feature = parsed.success ? parsed.data.features[0] : undefined;
  if (feature === undefined) {
    return { isOk: false, error: 'invalid' };
  }
  const [lng, lat] = feature.geometry.coordinates;
  if (!isInsideBoundingBox(lng, lat, BC_BOUNDING_BOX)) {
    return { isOk: false, error: 'outside-bc' };
  }
  return { isOk: true, value: { name: feature.properties.name.trim(), lng, lat } };
}
