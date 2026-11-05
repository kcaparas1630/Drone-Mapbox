// Tests the chase camera: 60 m behind and 25 m above by default, pulled back with speed, turned by orbit.
import { describe, expect, it } from 'vitest';

import { type ChaseCameraInput, computeChaseCamera } from './compute-chase-camera';

const METERS_PER_DEGREE_LAT = 111_195;

// Builds a camera input for a drone heading north at 1000 m with the given overrides.
function buildInput(overrides: Partial<ChaseCameraInput> = {}): ChaseCameraInput {
  return {
    lng: -122.75,
    lat: 53.92,
    altitudeMsl: 1000,
    headingRad: 0,
    speedRatio: 0,
    followDistanceM: 60,
    orbitYawRad: 0,
    orbitPitchRad: 0,
    arrivalAngleRad: 0,
    ...overrides,
  };
}

// Computes a pose for the input.
function computePose(input: ChaseCameraInput) {
  const pose = { lng: 0, lat: 0, altitudeMsl: 0, lookAtLng: 0, lookAtLat: 0, lookAtAltitudeMsl: 0 };
  computeChaseCamera(pose, input);
  return pose;
}

describe('computeChaseCamera', () => {
  it('sits 60 m behind and 25 m above a drone heading north and looks 40 m ahead of it', () => {
    const pose = computePose(buildInput());
    expect((53.92 - pose.lat) * METERS_PER_DEGREE_LAT).toBeCloseTo(60, 0);
    expect(pose.lng).toBeCloseTo(-122.75, 9);
    expect(pose.altitudeMsl).toBeCloseTo(1025, 6);
    expect((pose.lookAtLat - 53.92) * METERS_PER_DEGREE_LAT).toBeCloseTo(40, 0);
    expect(pose.lookAtLng).toBeCloseTo(-122.75, 9);
    expect(pose.lookAtAltitudeMsl).toBe(1000);
  });

  it('pushes the look-at point further ahead as the camera pulls back', () => {
    const fast = computePose(buildInput({ speedRatio: 1 }));
    expect((fast.lookAtLat - 53.92) * METERS_PER_DEGREE_LAT).toBeCloseTo(80, 0);
  });

  it('pulls back proportionally to speed and to the follow distance', () => {
    const fast = computePose(buildInput({ speedRatio: 1 }));
    expect(fast.altitudeMsl).toBeCloseTo(1050, 6);
    const far = computePose(buildInput({ followDistanceM: 120 }));
    expect(far.altitudeMsl).toBeCloseTo(1050, 6);
  });

  it('orbits to the side when the yaw offset is a quarter turn', () => {
    const pose = computePose(buildInput({ orbitYawRad: Math.PI / 2 }));
    expect(pose.lng).toBeLessThan(-122.75);
    expect(pose.lat).toBeCloseTo(53.92, 6);
  });

  it('clamps the elevation so the Mapbox pitch stays within 30–75°', () => {
    const pose = computePose(buildInput({ orbitPitchRad: 10 }));
    expect(pose.altitudeMsl - 1000).toBeCloseTo(65 * Math.sin(Math.PI / 3), 6);
  });
});
