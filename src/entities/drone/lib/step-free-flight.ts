// One fixed step of free-flight physics: yaw, bank, ground speed, climb and geodesic movement (behaviour §3.3).
import { FLIGHT_TUNING } from '@/shared/config';
import { computeDestinationPoint, type GeoPoint } from '@/shared/lib/geo';

import type { SimWorld } from '../model/sim-world';
import { stepFreeFlightSpeed } from './step-free-flight-speed';

const {
  YAW_RATE_RAD_PER_S,
  MAX_BANK_RAD,
  BANK_RESPONSE_PER_S,
  MAX_VERTICAL_MPS,
  VERTICAL_ACCELERATION_MPS2,
  CEILING_MSL_M,
} = FLIGHT_TUNING;
const FULL_TURN_RAD = 2 * Math.PI;
const scratchPoint: GeoPoint = { lng: 0, lat: 0 };

// Advances the world by dtS using world.input; terrain floor and BC clamp are applied by the caller.
export function stepFreeFlight(world: SimWorld, dtS: number): void {
  const { input } = world;
  world.headingRad =
    (((world.headingRad + input.yaw * YAW_RATE_RAD_PER_S * dtS) % FULL_TURN_RAD) + FULL_TURN_RAD) %
    FULL_TURN_RAD;
  const targetBankRad = input.yaw * MAX_BANK_RAD;
  world.bankRad += (targetBankRad - world.bankRad) * Math.min(1, BANK_RESPONSE_PER_S * dtS);
  world.speedMps = stepFreeFlightSpeed(world.speedMps, input.forward, input.isBoosting, dtS);
  const targetVerticalMps = input.vertical * MAX_VERTICAL_MPS;
  const verticalStepMps = VERTICAL_ACCELERATION_MPS2 * dtS;
  const verticalDeltaMps = targetVerticalMps - world.verticalSpeedMps;
  world.verticalSpeedMps +=
    Math.abs(verticalDeltaMps) <= verticalStepMps
      ? verticalDeltaMps
      : Math.sign(verticalDeltaMps) * verticalStepMps;
  world.altitudeMsl += world.verticalSpeedMps * dtS;
  world.isAtCeiling = world.altitudeMsl >= CEILING_MSL_M;
  if (world.isAtCeiling) {
    world.altitudeMsl = CEILING_MSL_M;
    world.verticalSpeedMps = Math.min(0, world.verticalSpeedMps);
  }
  world.previousLng = world.lng;
  world.previousLat = world.lat;
  computeDestinationPoint(
    scratchPoint,
    world.lng,
    world.lat,
    world.headingRad,
    world.speedMps * dtS,
  );
  world.lng = scratchPoint.lng;
  world.lat = scratchPoint.lat;
}
