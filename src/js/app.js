import 'maplibre-gl/dist/maplibre-gl.css';
import '../css/main.css';
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
});

window.game = game;
