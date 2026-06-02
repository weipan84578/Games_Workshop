import { App } from "./core/App.js";
import { AudioManager } from "./audio/AudioManager.js";
import { StateManager } from "./core/StateManager.js";
import { ThemeManager } from "./ui/ThemeManager.js";

const state = new StateManager();
const audio = new AudioManager(state);
const theme = new ThemeManager(state);
const app = new App({ state, audio, theme });

app.init();
