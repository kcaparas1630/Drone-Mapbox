// Public API of the fire entity: the BCWS feed API, normalised fires, selection and status display.
export { fireApi, useGetActiveFiresQuery } from './api/fire.api';
export type { FireFeedQueryArgs } from './api/fire.api';
export { FIRE_STATUS_PALETTE } from './config/fire-status-palette';
export type { Fire, FireFeedSnapshot, FireStatus, NearbyFires } from './model/fire.types';
export { FireStatusBadge } from './ui/fire-status-badge';
export type { FireStatusBadgeProps } from './ui/fire-status-badge';
