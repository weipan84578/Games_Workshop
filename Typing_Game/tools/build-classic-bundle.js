const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const wordFiles = {
  en: "data/words-en.json",
  zh: "data/words-zh.json",
  num: "data/words-num.json",
  mixed: "data/words-mixed.json",
  hira: "data/words-hira.json",
  kata: "data/words-kata.json",
};

const sourceFiles = [
  "js/utils/helpers.js",
  "js/utils/Formatter.js",
  "js/utils/Storage.js",
  "js/utils/Timer.js",
  "js/data/WordRepository.js",
  "js/game/DifficultyManager.js",
  "js/game/ScoreCalculator.js",
  "js/game/ComboSystem.js",
  "js/game/WordGenerator.js",
  "js/game/GameEngine.js",
  "js/ui/ThemeManager.js",
  "js/ui/ToastManager.js",
  "js/ui/ModalManager.js",
  "js/ui/KeyboardVisualizer.js",
  "js/ui/AnimationManager.js",
  "js/audio/SFXPool.js",
  "js/audio/BGMPlayer.js",
  "js/audio/AudioManager.js",
  "js/core/EventBus.js",
  "js/core/Router.js",
  "js/core/StateManager.js",
  "js/screens/MenuScreen.js",
  "js/screens/GameScreen.js",
  "js/screens/ResultScreen.js",
  "js/screens/TutorialScreen.js",
  "js/screens/SettingsScreen.js",
  "js/core/App.js",
];

function readUtf8(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readWords() {
  return Object.fromEntries(
    Object.entries(wordFiles).map(([language, file]) => {
      const words = JSON.parse(readUtf8(file));
      if (!Array.isArray(words) || words.length === 0) {
        throw new Error(`${file} must be a non-empty JSON array.`);
      }
      return [language, words];
    })
  );
}

function convertModuleToClassic(text) {
  return text
    .replace(/^import\s+[^;]+;\s*$/gm, "")
    .replace(/\bexport\s+class\b/g, "class")
    .replace(/\bexport\s+const\b/g, "const");
}

function build() {
  const embeddedWords = JSON.stringify(readWords());
  let bundle = "/* Generated classic bundle for direct file:// usage. Source modules remain in js/. */\n";
  bundle += "(function () {\n  'use strict';\n\n";
  bundle += `globalThis.TYPING_GAME_EMBEDDED_WORDS = ${embeddedWords};\n\n`;

  for (const file of sourceFiles) {
    bundle += `\n/* ${file} */\n${convertModuleToClassic(readUtf8(file))}\n`;
  }

  bundle += "\ndocument.addEventListener('DOMContentLoaded', function () {\n";
  bundle += "  const state = new StateManager();\n";
  bundle += "  const audio = new AudioManager(state);\n";
  bundle += "  const theme = new ThemeManager(state);\n";
  bundle += "  const app = new App({ state, audio, theme });\n";
  bundle += "  app.init();\n";
  bundle += "});\n})();\n";

  fs.writeFileSync(path.join(root, "js/app.classic.js"), bundle, "utf8");
  fs.writeFileSync(path.join(root, "js/app.bundle.js"), bundle, "utf8");
}

build();
