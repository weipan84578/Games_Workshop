const SETTINGS_KEY = '2048_settings';

const DEFAULTS = {
  size: 4,
  goal: 2048,
  undoLimit: 1,
  continueAfterWin: true,
  showTimer: false,
  animSpeed: 'normal',
  theme: 'classic',
  radius: 6,
  showGrid: false,
  highContrast: false,
  volMaster: 80,
  volSfx: 70,
  volBgm: 40,
  bgmTrack: 'electronic',
  muted: false,
};

const SettingsStore = (() => {
  let data = { ...DEFAULTS };

  function load() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) data = { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
  }

  function save() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  }

  function get(key) {
    return data[key];
  }

  function set(key, value) {
    data[key] = value;
    save();
  }

  function reset() {
    data = { ...DEFAULTS };
    save();
  }

  function getAll() {
    return { ...data };
  }

  load();
  return { get, set, reset, getAll, load };
})();
