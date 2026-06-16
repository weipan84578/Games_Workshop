import HomeScreen from '../screens/HomeScreen.js';
import LevelSelectScreen from '../screens/LevelSelectScreen.js';
import GameScreen from '../screens/GameScreen.js';
import InstructionsScreen from '../screens/InstructionsScreen.js';
import SettingsScreen from '../screens/SettingsScreen.js';
import { AudioManager } from '../audio/AudioManager.js';

const SCREENS = {
  home: HomeScreen,
  levels: LevelSelectScreen,
  game: GameScreen,
  instructions: InstructionsScreen,
  settings: SettingsScreen,
};

let currentScreen = null;

function parseHash(hash) {
  const safeHash = hash || '#home';
  const [path, query = ''] = safeHash.replace(/^#/, '').split('?');
  return {
    id: path || 'home',
    params: Object.fromEntries(new URLSearchParams(query)),
    full: safeHash,
  };
}

async function render() {
  const app = document.querySelector('#app');
  const route = parseHash(window.location.hash);
  const screen = SCREENS[route.id] ?? HomeScreen;

  currentScreen?.destroy?.();
  currentScreen = screen;
  AudioManager.play('screen_in');
  AudioManager.switchForRoute(route.full);
  await screen.init(app, route.params);
}

export const Router = {
  init() {
    window.addEventListener('hashchange', render);
    if (!window.location.hash) {
      window.location.hash = '#home';
      return;
    }
    render();
  },
  navigateTo(screen, params = {}) {
    AudioManager.play('screen_out');
    const query = new URLSearchParams(params).toString();
    window.location.hash = query ? `#${screen}?${query}` : `#${screen}`;
  },
  parseHash,
};
