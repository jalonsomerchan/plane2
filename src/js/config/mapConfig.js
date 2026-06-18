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

export const GAME_MODES = {
  tourism: {
    id: 'tourism',
    name: 'Modo turismo',
    description: 'Modo turismo: vuela sin límite y explora el relieve 3D.',
  },
  competition: {
    id: 'competition',
    name: 'Modo competición',
    description: 'Competición: atraviesa tantos aros como puedas antes de que acaben los 60 segundos.',
  },
};

export const COMPETITION_LEVELS = {
  easy: {
    id: 'easy',
    name: 'Nivel 1 · entrenamiento',
    durationSeconds: 60,
    ringRadiusMeters: 420,
    ringDistanceMeters: 2100,
    headingSpreadDegrees: 24,
    pointsPerRing: 100,
  },
  medium: {
    id: 'medium',
    name: 'Nivel 2 · piloto',
    durationSeconds: 60,
    ringRadiusMeters: 310,
    ringDistanceMeters: 2850,
    headingSpreadDegrees: 38,
    pointsPerRing: 150,
  },
  hard: {
    id: 'hard',
    name: 'Nivel 3 · as',
    durationSeconds: 60,
    ringRadiusMeters: 225,
    ringDistanceMeters: 3600,
    headingSpreadDegrees: 54,
    pointsPerRing: 220,
  },
};

export const MAP_CONFIG = {
  center: PRESET_LOCATIONS[0].center,
  initialZoom: 13.9,
  minZoom: 8.8,
  maxZoom: 19,
  pitch: 72,
  terrainExaggeration: 1.65,
  minFlightZoom: 12.35,
  maxFlightZoom: 15.95,
  altitudeZoomReferenceMeters: 1450,
  lookAheadMeters: 760,
  altitudeLookAheadFactor: 0.16,
  satelliteTiles: [
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  ],
  demTileJsonUrl: 'https://tiles.mapterhorn.com/tilejson.json',
};

export const FLIGHT_CONFIG = {
  startHeading: PRESET_LOCATIONS[0].heading,
  startSpeed: 420,
  minSpeed: 8,
  maxSpeed: 2200,
  cruiseSpeed: 620,
  throttleCurve: 1.55,
  accelerationResponse: 1.65,
  decelerationResponse: 0.52,
  turnRate: 24,
  steeringCurve: 1.45,
  steeringSmoothing: 2.4,
  startAltitude: 650,
  minAltitude: 0,
  groundCollisionAltitude: 16,
  maxAltitude: 6200,
  maxPitchAngle: 0.82,
  pitchSmoothing: 1.45,
  maxLiftSpeedRatio: 1.8,
  levelFlightSpeedRatio: 0.62,
  stallSpeedRatio: 0.34,
  pitchLiftRate: 420,
  airspeedLiftRate: 145,
  stallSinkRate: 680,
  maxClimbSpeed: 260,
  maxSinkSpeed: 480,
  verticalDrag: 0.52,
  diveBoost: 150,
  climbBrake: 55,
  storageBestScoreKey: 'plane2:best-distance',
};
