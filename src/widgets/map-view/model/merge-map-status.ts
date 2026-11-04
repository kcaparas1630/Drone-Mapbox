// Reducer for page-level map status: merges a patch and keeps the same object when nothing changed.
import type { MapStatus, MapStatusPatch } from './map-status.types';

// Returns the status with the patch applied, or the original object when every value is unchanged.
export function mergeMapStatus(status: MapStatus, patch: MapStatusPatch): MapStatus {
  const keys = Object.keys(patch) as (keyof MapStatus)[];
  const hasChange = keys.some((key) => patch[key] !== undefined && patch[key] !== status[key]);
  return hasChange ? { ...status, ...patch } : status;
}
