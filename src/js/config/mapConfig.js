export const PRESET_LOCATIONS = [
  {
    id: 'madrid',
    name: 'Madrid · Sierra y ciudad',
    center: [-3.7038, 40.4168],
    heading: 28,
  },
  {
    id: 'piornal',
    name: 'Piornal · Valle del Jerte',
    center: [-5.8476, 40.1191],
    heading: 224,
  },
  {
    id: 'tenerife',
    name: 'Tenerife · Teide',
    center: [-16.6435, 28.2723],
    heading: 132,
  },
  {
    id: 'granada',
    name: 'Granada · Sierra Nevada',
    center: [-3.5881, 37.1765],
    heading: 92,
  },
  {
    id: 'pirineos',
    name: 'Pirineos · Ordesa',
    center: [-0.1064, 42.6486],
    heading: 78,
  },
  {
    id: 'barcelona',
    name: 'Barcelona · Costa y ciudad',
    center: [2.1734, 41.3851],
    heading: 210,
  },
];

export const MAP_CONFIG = {
  center: PRESET_LOCATIONS[0].center,
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
  startHeading: PRESET_LOCATIONS[0].heading,
  startSpeed: 42,
  minSpeed: 20,
  maxSpeed: 165,
  acceleration: 38,
  drag: 12,
  turnRate: 58,
  storageBestScoreKey: 'plane2:best-distance',
};
