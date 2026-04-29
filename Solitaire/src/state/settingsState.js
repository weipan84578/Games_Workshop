const DEFAULTS = {
  drawMode: 1,
  unlimitedDraw: true,
  foundationMovable: true,
  freeEmpty: false,
  stackMode: 'alt-color',
  theme: 'classic',
  cardBack: 'blue-diamond',
  tableColor: '#1a6b3c',
  bgmVolume: 0.7,
  sfxVolume: 0.8,
  animationSpeed: 'normal',
  showMoves: true,
  autoFoundation: false,
};

let settings = { ...DEFAULTS };

export function getSettings() {
  return { ...settings };
}

export function loadSettings() {
  try {
    const saved = localStorage.getItem('sol_settings');
    if (saved) settings = { ...DEFAULTS, ...JSON.parse(saved) };
  } catch {
    settings = { ...DEFAULTS };
  }
  return settings;
}

export function saveSettings() {
  try {
    localStorage.setItem('sol_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Cannot save settings:', e);
  }
}

export function updateSetting(key, value) {
  settings[key] = value;
  saveSettings();
  return settings;
}

export function resetSettings() {
  settings = { ...DEFAULTS };
  saveSettings();
  return settings;
}
