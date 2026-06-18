import maplibregl from 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/+esm';
import { FLIGHT_CONFIG, MAP_CONFIG, PRESET_LOCATIONS } from '../config/mapConfig.js';
import { MobileFlightControls } from '../controls/MobileFlightControls.js';
import { clamp } from '../utils/math.js';
import { readNumber, writeNumber } from '../utils/storage.js';
import { moveLngLat } from './geo.js';
import { LocationPicker } from './LocationPicker.js';

const OVERLAY_HIDDEN_CLASS = 'is-hidden';
const START_TITLE = 'Elige salida y despega';
const START_MESSAGE =
  'Usa el mando para girar y cambiar altitud: tira para subir, empuja para bajar. La palanca controla una velocidad extrema. Antes de despegar, selecciona una localización con relieve 3D.';
const CRASH_TITLE = 'Has tocado suelo';
const CRASH_MESSAGE =
  'Impacto contra el terreno. Sube antes con el mando o mete más potencia para volver a despegar. Puedes cambiar la salida antes de reintentarlo.';

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
    locationSelect,
    locationSearchForm,
    locationSearchInput,
    locationResults,
    locationStatus,
  }) {
    this.scoreElement = scoreElement;
    this.bestScoreElement = bestScoreElement;
    this.overlayElement = overlayElement;
    this.overlayTitle = overlayElement.querySelector('#overlay-title');
    this.overlayMessage = overlayElement.querySelector('#overlay-message');
    this.playButton = playButton;
    this.speedElement = speedElement;
    this.startLocation = PRESET_LOCATIONS[0];
    this.controls = new MobileFlightControls({ steeringElement, throttleElement });
    this.bestScore = readNumber(FLIGHT_CONFIG.storageBestScoreKey);
    this.map = this.#createMap(mapElement);
    this.locationPicker = new LocationPicker({
      selectElement: locationSelect,
      formElement: locationSearchForm,
      inputElement: locationSearchInput,
      resultsElement: locationResults,
      statusElement: locationStatus,
      onSelect: (location) => this.#setStartLocation(location),
    });

    this.reset();
    this.#bindEvents();
    this.#setBestScore(this.bestScore);
    this.#setScore(0);
  }

  start() {
    this.reset();
    this.#hideOverlay();
    this.#isRunning = true;
    this.#lastTime = performance.now();
    this.#animationFrame = requestAnimationFrame((time) => this.#tick(time));
  }

  stop() {
    this.#isRunning = false;

    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = null;
    }
  }

  reset() {
    this.position = [...this.startLocation.center];
    this.heading = this.startLocation.heading ?? FLIGHT_CONFIG.startHeading;
    this.altitude = FLIGHT_CONFIG.startAltitude;
    this.verticalSpeed = 0;
    this.speed = FLIGHT_CONFIG.startSpeed;
    this.steeringInput = 0;
    this.distance = 0;
    this.#syncCamera(0);
    this.#setScore(0);
    this.#paintHud();
  }

  #hideOverlay() {
    this.overlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
    this.overlayElement.setAttribute('hidden', '');
    this.overlayElement.setAttribute('aria-hidden', 'true');
  }

  #showOverlay({ title = START_TITLE, message = START_MESSAGE, buttonText = 'Despegar' } = {}) {
    this.overlayTitle.textContent = title;
    this.overlayMessage.textContent = message;
    this.playButton.textContent = buttonText;
    this.overlayElement.classList.remove(OVERLAY_HIDDEN_CLASS);
    this.overlayElement.removeAttribute('hidden');
    this.overlayElement.setAttribute('aria-hidden', 'false');
  }

  #setStartLocation(location) {
    if (this.#isRunning) return;

    this.startLocation = location;
    this.position = [...location.center];
    this.heading = location.heading ?? FLIGHT_CONFIG.startHeading;
    this.altitude = FLIGHT_CONFIG.startAltitude;
    this.verticalSpeed = 0;
    this.speed = FLIGHT_CONFIG.startSpeed;
    this.steeringInput = 0;
    this.#syncCamera(450);
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
      center: this.startLocation.center,
      zoom: MAP_CONFIG.initialZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      pitch: MAP_CONFIG.pitch,
      bearing: this.startLocation.heading,
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
    if (!this.#isRunning) return;

    this.#syncCamera(90);
    this.#paintHud();

    this.#animationFrame = requestAnimationFrame((nextTime) => this.#tick(nextTime));
  }

  #updateFlight(deltaTime) {
    const altitudeInput = -this.controls.pitch;
    const targetVerticalSpeed =
      altitudeInput >= 0
        ? altitudeInput * FLIGHT_CONFIG.climbRate
        : altitudeInput * FLIGHT_CONFIG.sinkRate;
    const altitudeSmoothing = Math.min(1, FLIGHT_CONFIG.altitudeSmoothing * deltaTime);
    const rawSteering = this.controls.steering;
    const targetSteering = Math.sign(rawSteering) * Math.abs(rawSteering) ** FLIGHT_CONFIG.steeringCurve;
    const steeringSmoothing = Math.min(1, FLIGHT_CONFIG.steeringSmoothing * deltaTime);
    const throttle = this.controls.throttle;
    const throttleCurve = throttle ** FLIGHT_CONFIG.throttleCurve;
    const altitudeSpeedEffect =
      Math.max(0, -altitudeInput) * FLIGHT_CONFIG.diveBoost -
      Math.max(0, altitudeInput) * FLIGHT_CONFIG.climbBrake;
    const targetSpeed = clamp(
      FLIGHT_CONFIG.minSpeed + throttleCurve * (FLIGHT_CONFIG.maxSpeed - FLIGHT_CONFIG.minSpeed) + altitudeSpeedEffect,
      FLIGHT_CONFIG.minSpeed,
      FLIGHT_CONFIG.maxSpeed,
    );
    const speedResponse =
      targetSpeed > this.speed ? FLIGHT_CONFIG.accelerationResponse : FLIGHT_CONFIG.decelerationResponse;

    this.verticalSpeed += (targetVerticalSpeed - this.verticalSpeed) * altitudeSmoothing;
    this.altitude = clamp(
      this.altitude + this.verticalSpeed * deltaTime,
      FLIGHT_CONFIG.minAltitude,
      FLIGHT_CONFIG.maxAltitude,
    );
    this.speed += (targetSpeed - this.speed) * Math.min(1, speedResponse * deltaTime);
    this.steeringInput += (targetSteering - this.steeringInput) * steeringSmoothing;
    this.heading += this.steeringInput * FLIGHT_CONFIG.turnRate * deltaTime;
    this.position = moveLngLat(this.position, this.heading, this.speed * deltaTime);
    this.distance += this.speed * deltaTime;
    this.#setScore(Math.round(this.distance));
    this.#checkGroundCollision();
  }

  #checkGroundCollision() {
    if (this.altitude > FLIGHT_CONFIG.groundCollisionAltitude) return;

    this.altitude = 0;
    this.verticalSpeed = 0;
    this.#paintHud();
    this.stop();
    this.#showOverlay({
      title: CRASH_TITLE,
      message: CRASH_MESSAGE,
      buttonText: 'Volver a despegar',
    });
  }

  #syncCamera(duration) {
    if (!this.map) return;

    const altitudeRatio = clamp(this.altitude / MAP_CONFIG.altitudeZoomReferenceMeters, 0.32, 8.8);
    const zoom = clamp(
      MAP_CONFIG.initialZoom - Math.log2(altitudeRatio),
      MAP_CONFIG.minFlightZoom,
      MAP_CONFIG.maxFlightZoom,
    );
    const lookAhead =
      MAP_CONFIG.lookAheadMeters + this.speed * 1.65 + this.altitude * MAP_CONFIG.altitudeLookAheadFactor;
    const center = moveLngLat(this.position, this.heading, lookAhead);
    const camera = {
      center,
      bearing: this.heading,
      pitch: MAP_CONFIG.pitch,
      zoom,
      duration,
      essential: true,
    };

    if (this.#terrainReady) {
      this.map.easeTo(camera);
      return;
    }

    this.map.jumpTo(camera);
  }

  #paintHud() {
    this.speedElement.textContent = `${Math.round(this.speed * 3.6)} km/h · ${Math.round(this.altitude)} m`;
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
