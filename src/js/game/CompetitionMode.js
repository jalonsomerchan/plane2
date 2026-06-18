import { COMPETITION_LEVELS } from '../config/mapConfig.js';
import { distanceMeters, moveLngLat } from './geo.js';

const RING_SOURCE_ID = 'competition-rings';
const RING_FILL_LAYER_ID = 'competition-ring-fill';
const RING_OUTLINE_LAYER_ID = 'competition-ring-outline';
const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export class CompetitionMode {
  constructor({ map }) {
    this.map = map;
    this.level = COMPETITION_LEVELS.easy;
    this.score = 0;
    this.remainingSeconds = this.level.durationSeconds;
    this.nextRing = null;
    this.ringIndex = 0;
    this.active = false;
  }

  start({ levelId, position, heading }) {
    this.level = COMPETITION_LEVELS[levelId] ?? COMPETITION_LEVELS.easy;
    this.score = 0;
    this.remainingSeconds = this.level.durationSeconds;
    this.ringIndex = 0;
    this.active = true;
    this.#ensureMapLayers();
    this.#spawnRing(position, heading);
  }

  stop() {
    this.active = false;
    this.nextRing = null;
    this.#paintRing();
  }

  update({ deltaTime, position, heading }) {
    if (!this.active) return { finished: false, crossed: false };

    this.#ensureMapLayers();
    this.remainingSeconds = Math.max(0, this.remainingSeconds - deltaTime);
    if (this.remainingSeconds <= 0) {
      return { finished: true, crossed: false };
    }

    if (!this.nextRing) this.#spawnRing(position, heading);

    const crossed = distanceMeters(position, this.nextRing.center) <= this.level.ringRadiusMeters;
    if (!crossed) return { finished: false, crossed: false };

    this.score += this.level.pointsPerRing;
    this.#spawnRing(position, heading);
    return { finished: false, crossed: true };
  }

  get hud() {
    return {
      score: this.score,
      remainingSeconds: Math.ceil(this.remainingSeconds),
      levelName: this.level.name,
    };
  }

  #spawnRing(position, heading) {
    const direction = heading + this.#nextOffset();
    const center = moveLngLat(position, direction, this.level.ringDistanceMeters);
    this.ringIndex += 1;
    this.nextRing = { center, direction };
    this.#paintRing();
  }

  #nextOffset() {
    const spread = this.level.headingSpreadDegrees;
    const wave = Math.sin(this.ringIndex * 1.72) * spread;
    const alternating = this.ringIndex % 2 === 0 ? spread * 0.35 : -spread * 0.35;

    return wave + alternating;
  }

  #ensureMapLayers() {
    if (!this.map.isStyleLoaded?.()) return false;

    if (!this.map.getSource(RING_SOURCE_ID)) {
      this.map.addSource(RING_SOURCE_ID, {
        type: 'geojson',
        data: EMPTY_FEATURE_COLLECTION,
      });
    }

    if (!this.map.getLayer(RING_FILL_LAYER_ID)) {
      this.map.addLayer({
        id: RING_FILL_LAYER_ID,
        type: 'circle',
        source: RING_SOURCE_ID,
        paint: {
          'circle-color': '#38bdf8',
          'circle-opacity': 0.18,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 12, 14, 42, 17, 86],
        },
      });
    }

    if (!this.map.getLayer(RING_OUTLINE_LAYER_ID)) {
      this.map.addLayer({
        id: RING_OUTLINE_LAYER_ID,
        type: 'circle',
        source: RING_SOURCE_ID,
        paint: {
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': '#f8fafc',
          'circle-stroke-opacity': 0.92,
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 9, 2, 16, 7],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 12, 14, 42, 17, 86],
        },
      });
    }

    return true;
  }

  #paintRing() {
    const source = this.map.getSource(RING_SOURCE_ID);
    if (!source?.setData) return;

    if (!this.nextRing) {
      source.setData(EMPTY_FEATURE_COLLECTION);
      return;
    }

    source.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            radiusMeters: this.level.ringRadiusMeters,
          },
          geometry: {
            type: 'Point',
            coordinates: this.nextRing.center,
          },
        },
      ],
    });
  }
}
