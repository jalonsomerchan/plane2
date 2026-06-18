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
});

window.game = game;
