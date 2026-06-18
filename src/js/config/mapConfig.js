export const MAP_CONFIG = {
  center: [-3.7038, 40.4168],
  initialZoom: 15.8,
  minZoom: 12,
  maxZoom: 19,
  pitch: 72,
  terrainExaggeration: 1.65,
  cameraAltitudeMeters: 52,
  lookAheadMeters: 190,
  satelliteTiles: [
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  ],
  demTileJsonUrl: 'https://tiles.mapterhorn.com/tilejson.json',
};

export const FLIGHT_CONFIG = {
  startHeading: 28,
  startSpeed: 42,
  minSpeed: 20,
  maxSpeed: 165,
  acceleration: 38,
  drag: 12,
  turnRate: 58,
  storageBestScoreKey: 'plane2:best-distance',
};
