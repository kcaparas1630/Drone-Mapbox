// Animates the halo opacity each frame; disabled under reduced motion or reduced detail (behaviour §10).
import type { MeshBasicMaterial } from 'three';

import { computeBeaconPulse } from '@/entities/fire';

import type { FireBeacons } from './create-fire-beacons';

// Sets the halo materials' opacity for the current time.
export function applyBeaconPulse(
  beacons: FireBeacons,
  timeS: number,
  isPulseEnabled: boolean,
): void {
  (beacons.halos.material as MeshBasicMaterial).opacity = computeBeaconPulse(
    timeS,
    false,
    isPulseEnabled,
  );
  (beacons.notableHalos.material as MeshBasicMaterial).opacity = computeBeaconPulse(
    timeS,
    true,
    isPulseEnabled,
  );
}
