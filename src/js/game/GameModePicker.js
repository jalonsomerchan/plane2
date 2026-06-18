import { COMPETITION_LEVELS, GAME_MODES } from '../config/mapConfig.js';

export class GameModePicker {
  constructor({ modeSelect, levelSelect, statusElement, onChange }) {
    this.modeSelect = modeSelect;
    this.levelSelect = levelSelect;
    this.statusElement = statusElement;
    this.onChange = onChange;
    this.mode = GAME_MODES.tourism.id;
    this.level = COMPETITION_LEVELS.easy.id;

    this.#bindEvents();
    this.#syncUi();
  }

  get selection() {
    return {
      mode: this.mode,
      level: this.level,
    };
  }

  #bindEvents() {
    this.modeSelect.addEventListener('change', () => {
      this.mode = this.modeSelect.value;
      this.#syncUi();
      this.onChange(this.selection);
    });

    this.levelSelect.addEventListener('change', () => {
      this.level = this.levelSelect.value;
      this.#syncUi();
      this.onChange(this.selection);
    });
  }

  #syncUi() {
    const isCompetition = this.mode === GAME_MODES.competition.id;
    const selectedMode = GAME_MODES[this.mode] ?? GAME_MODES.tourism;
    const selectedLevel = COMPETITION_LEVELS[this.level] ?? COMPETITION_LEVELS.easy;

    this.levelSelect.disabled = !isCompetition;
    this.levelSelect.closest('label')?.classList.toggle('is-disabled', !isCompetition);
    this.statusElement.textContent = isCompetition
      ? `${selectedMode.description} ${selectedLevel.name}: aros de ${selectedLevel.ringRadiusMeters} m.`
      : selectedMode.description;
  }
}
