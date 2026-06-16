const KEY = 'wsp_settings';

const DEFAULT_SETTINGS = {
  bgmVolume: 0.75,
  sfxVolume: 0.95,
  bgmEnabled: true,
  sfxEnabled: true,
  theme: 'ocean',
  vibration: true,
  showTimer: true,
};

let current = { ...DEFAULT_SETTINGS };

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function write(settings) {
  current = { ...DEFAULT_SETTINGS, ...settings };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Storage can be unavailable in private modes; the game still runs.
  }
  window.dispatchEvent(new CustomEvent('settings-change', { detail: current }));
  return current;
}

export const SettingsManager = {
  load() {
    current = read();
    return current;
  },
  get() {
    return current;
  },
  update(patch) {
    return write({ ...current, ...patch });
  },
  reset() {
    return write(DEFAULT_SETTINGS);
  },
};
