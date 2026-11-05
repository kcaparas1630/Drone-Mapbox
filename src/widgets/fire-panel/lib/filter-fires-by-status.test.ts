// Tests the status chips' filtering, including Fires of Note under "Out of control".
import { describe, expect, it } from 'vitest';

import type { FireStatus, RankedFire } from '@/entities/fire';

import { FIRE_STATUS_FILTERS } from '../config/fire-status-filters';
import { filterFiresByStatus } from './filter-fires-by-status';

// Builds a ranked fire with a status.
function buildRanked(fireNumber: string, status: FireStatus): RankedFire {
  return {
    fire: {
      fireNumber,
      incidentName: fireNumber,
      status,
      rawStatus: status,
      isFireOfNote: status === 'Fire of Note',
      sizeHa: null,
      ignitionDateMs: null,
      location: null,
      cause: null,
      incidentUrl: null,
      lng: 0,
      lat: 0,
    },
    distanceM: 1,
    bearingRad: 0,
  };
}

const RANKED = [
  buildRanked('A', 'Out of Control'),
  buildRanked('B', 'Being Held'),
  buildRanked('C', 'Fire of Note'),
  buildRanked('D', 'New'),
];

// Returns the fire numbers kept by the filter with the given id.
function findKeptFireNumbers(filterId: string): string[] {
  const filter = FIRE_STATUS_FILTERS.find((candidate) => candidate.id === filterId);
  return filter === undefined
    ? []
    : filterFiresByStatus(RANKED, filter).map((entry) => entry.fire.fireNumber);
}

describe('filterFiresByStatus', () => {
  it('keeps every fire for All and only matching ones, in order, for a status', () => {
    expect(findKeptFireNumbers('all')).toEqual(['A', 'B', 'C', 'D']);
    expect(findKeptFireNumbers('outOfControl')).toEqual(['A', 'C']);
    expect(findKeptFireNumbers('new')).toEqual(['D']);
    expect(findKeptFireNumbers('underControl')).toEqual([]);
  });
});
