import { clamp } from '../utils/math.js';

const ACTIVE_CLASS = 'is-active';

export class MobileFlightControls {
  constructor({ steeringElement, throttleElement }) {
    this.keys = new Set();
    this.steeringElement = steeringElement;
    this.throttleElement = throttleElement;
    this.steeringValue = 0;
    this.throttleValue = 0.42;
    this.steeringActive = false;
    this.throttleActive = false;
    this.bindSteering();
    this.bindThrottle();
    this.bindKeyboard();
    this.paint();
  }

  get steering() {
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD') ? 1 : 0;
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA') ? 1 : 0;

    return clamp(this.steeringValue + right - left, -1, 1);
  }

  get throttle() {
    const up = this.keys.has('ArrowUp') || this.keys.has('KeyW') ? 0.32 : 0;
    const down = this.keys.has('ArrowDown') || this.keys.has('KeyS') ? 0.32 : 0;

    return clamp(this.throttleValue + up - down, 0, 1);
  }

  bindSteering() {
    this.steeringElement.addEventListener('pointerdown', (event) => {
      this.steeringActive = true;
      this.steeringElement.classList.add(ACTIVE_CLASS);
      this.updateSteering(event);
    });
    this.steeringElement.addEventListener('pointermove', (event) => {
      if (this.steeringActive) this.updateSteering(event);
    });
    window.addEventListener('pointerup', () => this.releaseSteering());
    window.addEventListener('pointercancel', () => this.releaseSteering());
  }

  bindThrottle() {
    this.throttleElement.addEventListener('pointerdown', (event) => {
      this.throttleActive = true;
      this.throttleElement.classList.add(ACTIVE_CLASS);
      this.updateThrottle(event);
    });
    this.throttleElement.addEventListener('pointermove', (event) => {
      if (this.throttleActive) this.updateThrottle(event);
    });
    window.addEventListener('pointerup', () => this.releaseThrottle());
    window.addEventListener('pointercancel', () => this.releaseThrottle());
  }

  bindKeyboard() {
    window.addEventListener('keydown', (event) => this.keys.add(event.code));
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
  }

  updateSteering(event) {
    const rect = this.steeringElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    this.steeringValue = clamp((event.clientX - centerX) / (rect.width * 0.42), -1, 1);
    this.paint();
  }

  releaseSteering() {
    if (!this.steeringActive) return;
    this.steeringActive = false;
    this.steeringValue = 0;
    this.steeringElement.classList.remove(ACTIVE_CLASS);
    this.paint();
  }

  updateThrottle(event) {
    const rect = this.throttleElement.getBoundingClientRect();
    this.throttleValue = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    this.paint();
  }

  releaseThrottle() {
    if (!this.throttleActive) return;
    this.throttleActive = false;
    this.throttleElement.classList.remove(ACTIVE_CLASS);
  }

  paint() {
    const throttlePercent = Math.round(this.throttleValue * 100);
    this.steeringElement.style.setProperty('--steering-angle', `${this.steeringValue * 86}deg`);
    this.steeringElement.setAttribute('aria-valuenow', String(Math.round(this.steeringValue * 100)));
    this.throttleElement.style.setProperty('--throttle-level', `${throttlePercent}%`);
    this.throttleElement.setAttribute('aria-valuenow', String(throttlePercent));
  }
}
