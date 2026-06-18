import { clamp } from '../utils/math.js';

const ACTIVE_CLASS = 'is-active';
const KEYBOARD_STEP = 0.55;

export class MobileFlightControls {
  constructor({ steeringElement, throttleElement }) {
    this.keys = new Set();
    this.steeringElement = steeringElement;
    this.throttleElement = throttleElement;
    this.steeringValue = 0;
    this.pitchValue = 0;
    this.throttleValue = 0.68;
    this.stickActive = false;
    this.throttleActive = false;
    this.bindStick();
    this.bindThrottle();
    this.bindKeyboard();
    this.paint();
  }

  get steering() {
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD') ? KEYBOARD_STEP : 0;
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA') ? KEYBOARD_STEP : 0;

    return clamp(this.steeringValue + right - left, -1, 1);
  }

  get pitch() {
    const up = this.keys.has('ArrowUp') || this.keys.has('KeyW') ? KEYBOARD_STEP : 0;
    const down = this.keys.has('ArrowDown') || this.keys.has('KeyS') ? KEYBOARD_STEP : 0;

    return clamp(this.pitchValue + up - down, -1, 1);
  }

  get throttle() {
    const boost = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 0.2 : 0;
    const brake = this.keys.has('Space') ? 0.24 : 0;

    return clamp(this.throttleValue + boost - brake, 0, 1);
  }

  bindStick() {
    this.steeringElement.addEventListener('pointerdown', (event) => {
      this.stickActive = true;
      this.steeringElement.setPointerCapture?.(event.pointerId);
      this.steeringElement.classList.add(ACTIVE_CLASS);
      this.updateStick(event);
    });
    this.steeringElement.addEventListener('pointermove', (event) => {
      if (this.stickActive) this.updateStick(event);
    });
    window.addEventListener('pointerup', () => this.releaseStick());
    window.addEventListener('pointercancel', () => this.releaseStick());
  }

  bindThrottle() {
    this.throttleElement.addEventListener('pointerdown', (event) => {
      this.throttleActive = true;
      this.throttleElement.setPointerCapture?.(event.pointerId);
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

  updateStick(event) {
    const rect = this.steeringElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.42;

    this.steeringValue = clamp((event.clientX - centerX) / radius, -1, 1);
    this.pitchValue = clamp((centerY - event.clientY) / radius, -1, 1);
    this.paint();
  }

  releaseStick() {
    if (!this.stickActive) return;

    this.stickActive = false;
    this.steeringValue = 0;
    this.pitchValue = 0;
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
    const stickX = Math.round(this.steeringValue * 42);
    const stickY = Math.round(this.pitchValue * -42);
    const ariaValue = `${Math.round(this.steeringValue * 100)},${Math.round(this.pitchValue * 100)}`;

    this.steeringElement.style.setProperty('--stick-x', `${stickX}%`);
    this.steeringElement.style.setProperty('--stick-y', `${stickY}%`);
    this.steeringElement.setAttribute('aria-valuetext', `giro ${ariaValue}`);
    this.throttleElement.style.setProperty('--throttle-level', `${throttlePercent}%`);
    this.throttleElement.setAttribute('aria-valuenow', String(throttlePercent));
  }
}
