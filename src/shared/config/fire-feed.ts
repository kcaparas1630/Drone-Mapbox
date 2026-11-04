// BCWS ArcGIS feed location, polling, staleness thresholds and safety limits (ADR 003, behaviour §7).

export const FIRE_FEED = {
  QUERY_URL:
    'https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/BCWS_ActiveFires_PublicView/FeatureServer/0/query',
  OUT_FIELDS:
    'FIRE_NUMBER,INCIDENT_NAME,FIRE_STATUS,CURRENT_SIZE,IGNITION_DATE,GEOGRAPHIC_DESCRIPTION,FIRE_URL,FIRE_OF_NOTE_IND,FIRE_CAUSE,FIRE_CENTRE',
  PAGE_SIZE: 1000,
  MAX_PAGES: 10,
  TIMEOUT_MS: 10_000,
  MAX_BYTES: 10 * 1024 * 1024,
  POLL_MS: 600_000,
  STALE_WARN_MS: 1_800_000,
  STALE_ERROR_MS: 7_200_000,
  INCIDENT_HOST: 'wildfiresituation.nrs.gov.bc.ca',
  NEARBY_RADIUS_M: 25_000,
} as const;
