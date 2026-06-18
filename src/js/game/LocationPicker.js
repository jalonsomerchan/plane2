import { PRESET_LOCATIONS } from '../config/mapConfig.js';

const SEARCH_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const SEARCH_LIMIT = 5;

export class LocationPicker {
  #abortController = null;

  constructor({ selectElement, formElement, inputElement, resultsElement, statusElement, onSelect }) {
    this.selectElement = selectElement;
    this.formElement = formElement;
    this.inputElement = inputElement;
    this.resultsElement = resultsElement;
    this.statusElement = statusElement;
    this.onSelect = onSelect;
    this.currentLocation = PRESET_LOCATIONS[0];
    this.searchResults = [];

    this.#paintPresetOptions();
    this.#bindEvents();
  }

  #paintPresetOptions() {
    this.selectElement.innerHTML = PRESET_LOCATIONS.map(
      (location) => `<option value="${location.id}">${location.name}</option>`,
    ).join('');
  }

  #bindEvents() {
    this.selectElement.addEventListener('change', () => this.#selectPreset());
    this.formElement.addEventListener('submit', (event) => this.#search(event));
  }

  #selectPreset() {
    const location = PRESET_LOCATIONS.find((item) => item.id === this.selectElement.value);

    if (!location) return;
    this.currentLocation = location;
    this.#clearResults();
    this.#setStatus(`Salida preparada en ${location.name}.`);
    this.onSelect(location);
  }

  async #search(event) {
    event.preventDefault();

    const query = this.inputElement.value.trim();
    if (query.length < 2) {
      this.#setStatus('Escribe al menos 2 letras para buscar una localización.');
      return;
    }

    this.#abortController?.abort();
    this.#abortController = new AbortController();
    this.#setStatus('Buscando localización...');
    this.resultsElement.innerHTML = '';

    try {
      const url = new URL(SEARCH_ENDPOINT);
      url.searchParams.set('format', 'jsonv2');
      url.searchParams.set('limit', String(SEARCH_LIMIT));
      url.searchParams.set('q', query);

      const response = await fetch(url, {
        signal: this.#abortController.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Search failed');

      const places = await response.json();
      this.#paintResults(this.#normalizePlaces(places));
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.#setStatus('No he podido buscar ahora. Prueba otra localización o usa una predefinida.');
    }
  }

  #normalizePlaces(places) {
    return places
      .map((place) => ({
        name: place.display_name ?? 'Localización sin nombre',
        center: [Number(place.lon), Number(place.lat)],
      }))
      .filter((place) => place.center.every(Number.isFinite));
  }

  #paintResults(places) {
    this.searchResults = places;

    if (!places.length) {
      this.#setStatus('No he encontrado resultados. Prueba con otro nombre.');
      return;
    }

    this.#setStatus('Elige un resultado para fijar el punto de salida.');
    this.resultsElement.innerHTML = places
      .map((place, index) => this.#resultTemplate(place, index))
      .join('');

    [...this.resultsElement.querySelectorAll('button')].forEach((button) => {
      button.addEventListener('click', () => this.#selectSearchResult(button));
    });
  }

  #resultTemplate(place, index) {
    const name = this.#escapeText(place.name);

    return `
      <button class="location-result" type="button" data-index="${index}">
        <span>${name}</span>
      </button>
    `;
  }

  #selectSearchResult(button) {
    const place = this.searchResults[Number(button.dataset.index)];
    if (!place) return;

    const location = {
      id: `search-${Date.now()}`,
      name: place.name,
      center: place.center,
      heading: 28,
    };

    this.currentLocation = location;
    this.selectElement.value = PRESET_LOCATIONS[0].id;
    this.#setStatus(`Salida preparada en ${place.name}.`);
    this.onSelect(location);
  }

  #clearResults() {
    this.searchResults = [];
    this.resultsElement.innerHTML = '';
  }

  #setStatus(message) {
    this.statusElement.textContent = message;
  }

  #escapeText(value) {
    const span = document.createElement('span');
    span.textContent = value;
    return span.innerHTML;
  }
}
