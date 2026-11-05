// Public API of the fire entity: the BCWS feed API, normalised fires, the Out filter, selection and status display.
export { fireApi } from './api/fire.api';
export type { FireFeedQueryArgs } from './api/fire.api';
export { useFireFeedQuery } from './api/use-fire-feed-query';
export type { FireFeedQueryOptions } from './api/use-fire-feed-query';
export { FIRE_STATUS_PALETTE } from './config/fire-status-palette';
export { computeBeaconPulse } from './lib/compute-beacon-pulse';
export { computeBeaconSize } from './lib/compute-beacon-size';
export type { BeaconSize } from './lib/compute-beacon-size';
export { findNearbyFires } from './lib/find-nearby-fires';
export {
  fireFilterSlice,
  outFiresVisibilityChanged,
  selectIsOutIncluded,
} from './model/fire-filter.slice';
export type { FireFilterState } from './model/fire-filter.slice';
export type { Fire, FireFeedSnapshot, FireStatus, NearbyFires } from './model/fire.types';
export {
  fireDeselected,
  fireSelected,
  selectedFireSlice,
  selectSelectedFireNumber,
} from './model/selected-fire.slice';
export type { SelectedFireState } from './model/selected-fire.slice';
export { FireStatusBadge } from './ui/fire-status-badge';
export type { FireStatusBadgeProps } from './ui/fire-status-badge';
