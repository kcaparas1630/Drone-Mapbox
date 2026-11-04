// Our own wildfire shapes, independent of the ArcGIS field names (ADR 003: only entities/fire/api knows them).

export type FireStatus =
  'Out of Control' | 'Being Held' | 'Under Control' | 'New' | 'Fire of Note' | 'Out' | 'Unknown';

export type Fire = {
  fireNumber: string;
  incidentName: string;
  status: FireStatus;
  rawStatus: string;
  isFireOfNote: boolean;
  sizeHa: number | null;
  ignitionDateMs: number | null;
  location: string | null;
  cause: string | null;
  incidentUrl: string | null;
  lng: number;
  lat: number;
};

export type FireFeedSnapshot = {
  fires: Fire[];
  fetchedAtMs: number;
  droppedCount: number;
  duplicateCount: number;
  isTruncated: boolean;
};

export type NearbyFires = { count: number; nearest: { fire: Fire; distanceM: number } | null };
