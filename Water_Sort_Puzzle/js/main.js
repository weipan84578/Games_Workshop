import { AudioManager } from './audio/AudioManager.js';
import { Router } from './router/Router.js';
import { SettingsManager } from './storage/SettingsManager.js';
import { ThemeManager } from './ui/ThemeManager.js';

(async () => {
  const settings = SettingsManager.load();
  ThemeManager.apply(settings.theme);
  AudioManager.init(settings);
  Router.init();
})();
