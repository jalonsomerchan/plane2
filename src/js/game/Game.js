import maplibregl from 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/+esm';
import { MAP_CONFIG, FLIGHT_CONFIG } from '../config/mapConfig.js';
import { MobileFlightControls } from '../controls/MobileFlightControls.js';
import { moveLngLat } from './geo.js';
import { clamp } from '../utils/math.js';
import { readNumber, writeNumber } from '../utils/storage.js';

export class Game {
  #animationFrame = null;
  #lastTime = 0;
  #isRunning = false;
  #terrainReady = false;

  constructor({
    mapElement,
    scoreElement,
    bestScoreElement,
    overlayElement,
    playButton,
    steeringElement,
    throttleElement,
    speedElement,
  }) {
    this.scoreElement = scoreElement;
    this.bestScoreElement = bestScoreElement;
    this.overlayElement = overlayElement;
    this.playButton = playButton;
    this.speedElement = speedElement;
    this.controls = new MobileFlightControls({ steeringElement, throttleElement });
    this.bestScore = readNumber(FLIGHT_CONFIG.storageBestScoreKey);
    this.map = this.#createMap(mapElement);

    this.reset();
    this.#bindEvents();
    this.#setBestScore(this.bestScore);
    this.#setScore(0);
  }

  start() {
    this.reset();
    this.overlayElement.hidden = true;
    this.#isRunning = true;
    this.#lastTime = performance.now();
    this.#animationFrame = requestAnimationFrame((time) => this.#tick(time));
  }

  stop() {
    this.#isRunning = false;

    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
    }
  }

  reset() {
    this.position = [...MAP_CONFIG.center];
    this.heading = FLIGHT_CONFIG.startHeading;
    this.speed = FLIGHT_CONFIG.startSpeed;
    this.distance = 0;
    this.#syncCamera(0);
    this.#setScore(0);
  }

  #createMap(container) {
    const map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: MAP_CONFIG.satelliteTiles,
            tileSize: 256,
            attribution: '&copy; Esri',
          },
        },
        layers: [
          {
            id: 'satellite-base',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.initialZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      pitch: MAP_CONFIG.pitch,
      bearing: FLIGHT_CONFIG.startHeading,
      maxPitch: 85,
      antialias: true,
      attributionControl: false,
    });

    map.on('load', () => this.#setupTerrain());
    map.on('style.load', () => this.#setupTerrain());

    return map;
  }

  #setupTerrain() {
    if (!this.map.getSource('terrainSource')) {
      this.map.addSource('terrainSource', {
        type: 'raster-dem',
        url: MAP_CONFIG.demTileJsonUrl,
      });
    }

    if (!this.map.getSource('hillshadeSource')) {
      this.map.addSource('hillshadeSource', {
        type: 'raster-dem',
        url: MAP_CONFIG.demTileJsonUrl,
      });
    }

    if (!this.map.getLayer('terrain-hillshade')) {
      this.map.addLayer({
        id: 'terrain-hillshade',
        type: 'hillshade',
        source: 'hillshadeSource',
        paint: {
          'hillshade-exaggeration': 0.42,
          'hillshade-shadow-color': '#0f172a',
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#64748b',
        },
      });
    }

    this.map.setTerrain({
      source: 'terrainSource',
      exaggeration: MAP_CONFIG.terrainExaggeration,
    });
    this.#terrainReady = true;
    this.#syncCamera(0);
  }

  #tick(time) {
    if (!this.#isRunning) return;

    const deltaTime = Math.min((time - this.#lastTime) / 1000, 0.05);
    this.#lastTime = time;

    this.#updateFlight(deltaTime);
    this.#syncCamera(260);
    this.#paintHud();

    this.#animationFrame = requestAnimationFrame((nextTime) => this.#tick(nextTime));
  }

  #updateFlight(deltaTime) {
    const throttleForce = this.controls.throttle * FLIGHT_CONFIG.acceleration;
    this.speed = clamp(
      this.speed + (throttleForce - FLIGHT_CONFIG.drag) * deltaTime,
      FLIGHT_CONFIG.minSpeed,
      FLIGHT_CONFIG.maxSpeed,
    );
    this.heading += this.controls.steering * FLIGHT_CONFIG.turnRate * deltaTime;
    this.position = moveLngLat(this.position, this.heading, this.speed * deltaTime);
    this.distance += this.speed * deltaTime;
    this.#setScore(Math.round(this.distance));
  }

  #syncCamera(duration) {
    if (!this.map) return;

    const center = moveLngLat(this.position, this.heading, MAP_CONFIG.lookAheadMeters);
    const camera = {
      center,
      bearing: this.heading,
      pitch: MAP_CONFIG.pitch,
      zoom: MAP_CONFIG.initialZoom,
      duration,
      essential: true,
    };

    if (this.#terrainReady && this.map.setFreeCameraOptions) {
      this.map.easeTo(camera);
      return;
    }

    this.map.jumpTo(camera);
  }

  #paintHud() {
    this.speedElement.textContent = `${Math.round(this.speed * 3.6)} km/h`;
  }

  #bindEvents() {
    this.playButton.addEventListener('click', () => this.start());
    window.addEventListener('blur', () => this.stop());
  }

  #setScore(score) {
    this.scoreElement.textContent = String(score);

    if (score > this.bestScore) {
      this.bestScore = score;
      writeNumber(FLIGHT_CONFIG.storageBestScoreKey, score);
      this.#setBestScore(score);
    }
  }

  #setBestScore(score) {
    this.bestScoreElement.textContent = String(score);
  }
}
