// Measures how far the camera Mapbox renders strays from the chase-camera pose during a flight (ADR 020).
import type { Page } from '@playwright/test';

import type { DebugWindow } from './debug-window.types';

type DriftWindow = DebugWindow & {
  fireflybcCameraDrift?: { maxDriftM: number; handleRender: () => void };
};

// Runs the flight and returns the largest gap in metres between the rendered camera and the pose.
export async function measureCameraDrift(page: Page, fly: () => Promise<void>): Promise<number> {
  await page.evaluate(() => {
    const driftWindow = window as DriftWindow;
    const debug = driftWindow.fireflybcDebug;
    if (debug === undefined) {
      throw new Error('window.fireflybcDebug is missing; run this spec against the dev server.');
    }
    const metresPerDegree = 111_195;
    const drift = { maxDriftM: 0, handleRender: () => undefined };
    drift.handleRender = () => {
      const pose = debug.cameraPose;
      const position = debug.map.getFreeCameraOptions().position;
      if (position === undefined || (pose.lng === 0 && pose.lat === 0)) {
        return;
      }
      const rendered = position.toLngLat();
      const northM = (rendered.lat - pose.lat) * metresPerDegree;
      const eastM =
        (rendered.lng - pose.lng) * metresPerDegree * Math.cos((pose.lat * Math.PI) / 180);
      const upM = position.toAltitude() - pose.altitudeMsl;
      drift.maxDriftM = Math.max(drift.maxDriftM, Math.hypot(northM, eastM, upM));
    };
    driftWindow.fireflybcCameraDrift = drift;
    debug.map.on('render', drift.handleRender);
  });
  await fly();
  return page.evaluate(() => {
    const driftWindow = window as DriftWindow;
    const drift = driftWindow.fireflybcCameraDrift;
    if (drift !== undefined) {
      driftWindow.fireflybcDebug?.map.off('render', drift.handleRender);
    }
    return drift?.maxDriftM ?? Number.POSITIVE_INFINITY;
  });
}
