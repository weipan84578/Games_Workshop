import { createStateManager } from "./core/stateManager.js";
import { SCREENS } from "./utils/constants.js";
import { createI18n } from "./i18n/i18n.js";
import { createAudioManager } from "./audio/audioManager.js";
import { createMainMenu } from "./ui/mainMenu.js";
import { createGamePage } from "./ui/gamePage.js";
import { createInstructionsPage } from "./ui/instructionsPage.js";
import { createSettingsPage } from "./ui/settingsPage.js";
import { clearProgress, getStorage, loadSettings } from "./utils/storage.js";

if (!globalThis.__CUTE_BOWLING_FALLBACK_STARTED__) {

const storage = getStorage();
const savedSettings = loadSettings(storage);
const i18n = createI18n({ storage, documentRef: document });
const audio = createAudioManager();
const stateManager = createStateManager(SCREENS.MENU);
const sections = {
  [SCREENS.MENU]: document.querySelector("#screen-main-menu"),
  [SCREENS.GAME]: document.querySelector("#screen-game"),
  [SCREENS.INSTRUCTIONS]: document.querySelector("#screen-instructions"),
  [SCREENS.SETTINGS]: document.querySelector("#screen-settings"),
};

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const themeStyle = document.querySelector("#theme-style");
  if (themeStyle) themeStyle.href = `css/themes/${theme === "cute" ? "theme-cute" : `theme-${theme}`}.css`;
}

applyTheme(savedSettings.theme);
i18n.setLanguage(savedSettings.language);
audio.setBgmVolume(savedSettings.bgmVolume);
audio.setSfxVolume(savedSettings.sfxVolume);

let settingsReturnTo = SCREENS.MENU;

function navigate(screen, payload = {}) {
  stateManager.transition(screen, payload);
}

const mainMenu = createMainMenu({
  section: sections[SCREENS.MENU],
  i18n,
  storage,
  audio,
  onStart: (gameState) => {
    clearProgress(storage);
    navigate(SCREENS.GAME, { gameState });
  },
  onContinue: (gameState) => {
    if (!gameState) {
      mainMenu.refresh();
      return;
    }
    navigate(SCREENS.GAME, { gameState });
  },
  onNavigate: navigate,
});

const settingsPage = createSettingsPage({
  section: sections[SCREENS.SETTINGS],
  i18n,
  storage,
  audio,
  onBack: () => {
    const next = settingsReturnTo === SCREENS.GAME ? SCREENS.GAME : SCREENS.MENU;
    navigate(next, next === SCREENS.GAME ? { gameState: gamePage.getState() } : {});
  },
});

const gamePage = createGamePage({
  section: sections[SCREENS.GAME],
  i18n,
  storage,
  audio,
  getSettings: () => settingsPage.getSettings(),
  onNavigate: (screen, payload = {}) => {
    if (screen === SCREENS.SETTINGS) settingsReturnTo = payload.returnTo || SCREENS.GAME;
    navigate(screen, payload);
  },
});

const instructionsPage = createInstructionsPage({
  section: sections[SCREENS.INSTRUCTIONS],
  i18n,
  audio,
  onBack: () => navigate(SCREENS.MENU),
});

function activateScreen(screen) {
  Object.entries(sections).forEach(([name, element]) => {
    element.classList.toggle("active", name === screen);
  });
}

stateManager.subscribe(({ screen, payload }) => {
  activateScreen(screen);
  audio.setScreen(screen);
  if (screen === SCREENS.MENU) {
    audio.playBgm();
    mainMenu.mount();
  } else if (screen === SCREENS.GAME) {
    audio.playBgm();
    gamePage.mount(payload.gameState || gamePage.getState());
  } else if (screen === SCREENS.INSTRUCTIONS) {
    audio.playBgm();
    instructionsPage.mount();
  } else if (screen === SCREENS.SETTINGS) {
    settingsReturnTo = payload.returnTo || SCREENS.MENU;
    audio.playBgm();
    settingsPage.mount();
  }
});

document.addEventListener("language-changed", () => {
  const language = i18n.getLanguage();
  document.documentElement.lang = language === "zh" ? "zh-Hant" : language;
  document.title = i18n.t("app_title");
  mainMenu.refresh();
  instructionsPage.refresh();
  settingsPage.refresh();
  gamePage.refresh();
});

document.documentElement.lang = savedSettings.language === "zh" ? "zh-Hant" : savedSettings.language;
document.title = i18n.t("app_title");
stateManager.transition(SCREENS.MENU);
globalThis.__CUTE_BOWLING_READY__ = true;
}
