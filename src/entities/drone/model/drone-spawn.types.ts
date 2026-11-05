// Where the drone appears at launch; a null altitude means "500 m above terrain once terrain loads".

export type DroneSpawn = {
  lng: number;
  lat: number;
  altitudeMsl: number | null;
  headingRad: number;
};
