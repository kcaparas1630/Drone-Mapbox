// Copies the simulation into Redux for the HUD at most 4 times a second, skipping unchanged values (ADR 011).
import { droneSnapshotPublished, type SimWorld } from '@/entities/drone';
import { toDegrees } from '@/shared/lib/geo';

let lastPublishedKey = '';

// Dispatches a rounded snapshot of the world when anything the HUD shows has changed.
export function publishDroneSnapshot(store: AppStore, world: SimWorld, nowMs: number): void {
  const isTerrainMissing = world.terrainSamplesM.every((sample) => sample === null);
  const altitudeAgl =
    world.groundElevationM === null ? null : Math.round(world.altitudeMsl - world.groundElevationM);
  const snapshot = {
    lng: world.lng,
    lat: world.lat,
    altitudeMsl: Math.round(world.altitudeMsl),
    altitudeAgl,
    speedMps: Math.round(Math.abs(world.speedMps)),
    verticalSpeedMps: Math.round(world.verticalSpeedMps),
    headingDeg: Math.round(toDegrees(world.headingRad)) % 360,
    isAtBcEdge: world.isAtBcEdge,
    isAtCeiling: world.isAtCeiling,
    isTerrainMissing,
    publishedAtMs: nowMs,
  };
  const key = [
    snapshot.lng.toFixed(5),
    snapshot.lat.toFixed(5),
    snapshot.altitudeMsl,
    altitudeAgl,
    snapshot.speedMps,
    snapshot.verticalSpeedMps,
    snapshot.headingDeg,
    snapshot.isAtBcEdge,
    snapshot.isAtCeiling,
    isTerrainMissing,
  ].join('|');
  if (key === lastPublishedKey) {
    return;
  }
  lastPublishedKey = key;
  store.dispatch(droneSnapshotPublished(snapshot));
}
