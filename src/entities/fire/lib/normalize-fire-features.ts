// Converts validated ArcGIS features to our Fire type; drops bad or out-of-BC points, last duplicate wins (§10).
import { BC_BOUNDING_BOX } from '@/shared/config';
import { isInsideBoundingBox } from '@/shared/lib/geo';

import type { FireFeature } from '../model/fire.schema';
import type { Fire } from '../model/fire.types';
import { normalizeFireStatus } from './normalize-fire-status';
import { parseIncidentUrl } from './parse-incident-url';

export type NormalizeFireFeaturesResult = {
  fires: Fire[];
  droppedCount: number;
  duplicateCount: number;
};

// Returns trimmed text, or null for missing or blank values.
function readText(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

// Returns the Fire for a feature with a valid in-BC point, or null when it must be dropped.
function toFire(feature: FireFeature): Fire | null {
  const { geometry, properties } = feature;
  const [lng, lat] = geometry?.type === 'Point' ? geometry.coordinates : [];
  if (lng === undefined || lat === undefined || !isInsideBoundingBox(lng, lat, BC_BOUNDING_BOX)) {
    return null;
  }
  const rawStatus = readText(properties.FIRE_STATUS) ?? 'Unknown';
  const status = normalizeFireStatus(rawStatus);
  const size = properties.CURRENT_SIZE;
  const ignition = properties.IGNITION_DATE;
  return {
    fireNumber: properties.FIRE_NUMBER.trim(),
    incidentName: readText(properties.INCIDENT_NAME) ?? properties.FIRE_NUMBER.trim(),
    status,
    rawStatus,
    isFireOfNote: properties.FIRE_OF_NOTE_IND === 'Y' || status === 'Fire of Note',
    sizeHa: typeof size === 'number' && Number.isFinite(size) && size >= 0 ? size : null,
    ignitionDateMs: typeof ignition === 'number' && Number.isFinite(ignition) ? ignition : null,
    location: readText(properties.GEOGRAPHIC_DESCRIPTION),
    cause: readText(properties.FIRE_CAUSE),
    incidentUrl: parseIncidentUrl(properties.FIRE_URL),
    lng,
    lat,
  };
}

// Returns the fires keyed by fire number (last wins) with counts of dropped and duplicate features.
export function normalizeFireFeatures(
  features: readonly FireFeature[],
): NormalizeFireFeaturesResult {
  const firesByNumber = new Map<string, Fire>();
  let droppedCount = 0;
  let duplicateCount = 0;
  for (const feature of features) {
    const fire = toFire(feature);
    if (fire === null) {
      droppedCount += 1;
      continue;
    }
    if (firesByNumber.has(fire.fireNumber)) {
      duplicateCount += 1;
    }
    firesByNumber.set(fire.fireNumber, fire);
  }
  return { fires: [...firesByNumber.values()], droppedCount, duplicateCount };
}
