// Memory of the terrain-following controller: the current target and how long every sample has been missing.

export type TerrainFollowState = { targetMsl: number | null; allMissingS: number };

// Returns a controller state with no target yet.
export function createTerrainFollowState(): TerrainFollowState {
  return { targetMsl: null, allMissingS: 0 };
}
