import { BGMController } from './BGMController.js';
import { SFXController } from './SFXController.js';
import { SettingsManager } from '../storage/SettingsManager.js';

let audioContext = null;
let settings = null;

function getContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function routeToTrack(route) {
  if (route.startsWith('#game')) {
    const query = route.split('?')[1] ?? '';
    const params = new URLSearchParams(query);
    const diff = params.get('diff') ?? 'easy';
    return diff === 'hard' ? 'bgm_hard' : diff === 'normal' ? 'bgm_normal' : 'bgm_easy';
  }
  return 'bgm_menu';
}

export const AudioManager = {
  init(initialSettings) {
    settings = initialSettings;
    SFXController.init(getContext, () => settings);
    BGMController.init(getContext, () => settings);
    window.addEventListener('settings-change', (event) => {
      settings = event.detail;
      if (!settings.bgmEnabled) BGMController.stop();
      if (settings.bgmEnabled) BGMController.switchTo(routeToTrack(window.location.hash || '#home'));
    });
  },
  play(id) {
    SFXController.play(id);
    const current = SettingsManager.get();
    if (current.vibration && navigator.vibrate && ['invalid', 'level_clear'].includes(id)) {
      navigator.vibrate(id === 'invalid' ? 40 : [25, 35, 25]);
    }
  },
  switchForRoute(route) {
    BGMController.switchTo(routeToTrack(route));
  },
};
