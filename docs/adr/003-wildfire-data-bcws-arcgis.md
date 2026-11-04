# ADR 003 — Live wildfire data from the BCWS ArcGIS FeatureServer, fetched client-side

Status: Accepted (2026-11-04)

## Context

The point of the app is to see BC wildfires. The BC Wildfire Service publishes open data in two
places: a GeoServer WFS on `openmaps.gov.bc.ca` and an ArcGIS Online feature service.

Verified on 2026-11-04 with `curl -H "Origin: https://example.com"`:

| Feed | CORS | Size (all 2026 rows) | Notes |
|---|---|---|---|
| GeoServer WFS `PROT_CURRENT_FIRE_PNTS_SP` | **no** `Access-Control-Allow-Origin` | 1.1 MB | unusable from a browser |
| ArcGIS `BCWS_ActiveFires_PublicView/FeatureServer/0` | `Access-Control-Allow-Origin: *` | 723 KB / 1000-row page | `maxRecordCount` 1000, pagination supported, `Cache-Control: max-age=300` |

Filtering `FIRE_STATUS<>'Out'` returned 23 rows / 17 KB in November; several hundred are expected
in peak summer. `FIRE_STATUS` values: `Fire of Note`, `New`, `Out of Control`, `Being Held`,
`Under Control`, `Out`. Useful fields: `FIRE_NUMBER`, `INCIDENT_NAME`, `FIRE_STATUS`,
`CURRENT_SIZE` (ha), `IGNITION_DATE` (epoch ms), `GEOGRAPHIC_DESCRIPTION`, `FIRE_URL`,
`FIRE_OF_NOTE_IND`, `FIRE_CAUSE`, `FIRE_CENTRE`.

## Options considered

1. **Not in MVP.** Map + drone only.
2. **Build-time snapshot.** Bundle GeoJSON at build; stale until redeploy.
3. **Live, client-side from BCWS open data.** No key, no server; depends on their CORS and feed
   stability.
4. **Live via our own proxy/cache.** Stable shape, rate control; needs a server.

## Decision

**Option 3**, using the ArcGIS layer:

```
GET https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/BCWS_ActiveFires_PublicView/FeatureServer/0/query
    ?where=FIRE_STATUS<>'Out'
    &outFields=FIRE_NUMBER,INCIDENT_NAME,FIRE_STATUS,CURRENT_SIZE,IGNITION_DATE,GEOGRAPHIC_DESCRIPTION,FIRE_URL,FIRE_OF_NOTE_IND,FIRE_CAUSE,FIRE_CENTRE
    &f=geojson&outSR=4326&resultRecordCount=1000&resultOffset=<n>
```

Loop while `properties.exceededTransferLimit` is true. Validate with zod, normalise to our `Fire`
type, poll every 10 minutes via RTK Query, keep the last good data on error.

## Consequences

- ArcGIS returns HTTP 200 with `{ "error": … }` on bad queries; the schema must reject that.
- `FIRE_URL` is rendered as a link only if its host is `wildfiresituation.nrs.gov.bc.ca`.
- `entities/fire/api` is the only module that knows the ArcGIS shape; a proxy can replace it later.
