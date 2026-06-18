import { Game } from './game/Game.js';

const game = new Game({
  mapElement: document.querySelector('#flight-map'),
  scoreElement: document.querySelector('#score'),
  bestScoreElement: document.querySelector('#best-score'),
  overlayElement: document.querySelector('#overlay'),
  playButton: document.querySelector('#play-button'),
  steeringElement: document.querySelector('#steering-control'),
  throttleElement: document.querySelector('#throttle-control'),
  speedElement: document.querySelector('#speed-readout'),
  locationSelect: document.querySelector('#location-select'),
  locationSearchForm: document.querySelector('#location-search-form'),
  locationSearchInput: document.querySelector('#location-search-input'),
  locationResults: document.querySelector('#location-results'),
  locationStatus: document.querySelector('#location-status'),
  gameModeSelect: document.querySelector('#game-mode-select'),
  competitionLevelSelect: document.querySelector('#competition-level-select'),
  modeStatus: document.querySelector('#mode-status'),
  modeReadout: document.querySelector('#mode-readout'),
  competitionHud: document.querySelector('#competition-hud'),
  competitionScore: document.querySelector('#competition-score'),
  competitionTime: document.querySelector('#competition-time'),
});

window.game = game;
