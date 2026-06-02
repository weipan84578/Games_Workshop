import { EventBus } from "./EventBus.js";
import { Router } from "./Router.js";
import { ModalManager } from "../ui/ModalManager.js";
import { ToastManager } from "../ui/ToastManager.js";
import { WordRepository } from "../data/WordRepository.js";
import { MenuScreen } from "../screens/MenuScreen.js";
import { GameScreen } from "../screens/GameScreen.js";
import { ResultScreen } from "../screens/ResultScreen.js";
import { TutorialScreen } from "../screens/TutorialScreen.js";
import { SettingsScreen } from "../screens/SettingsScreen.js";

export class App {
  constructor({ state, audio, theme }) {
    this.state = state;
    this.audio = audio;
    this.theme = theme;
    this.events = new EventBus();
    this.words = new WordRepository();
    this.router = null;
    this.toast = null;
    this.modal = null;
  }

  init() {
    this.theme.apply();
    this.audio.initGestureUnlock();
    this.toast = new ToastManager(document.querySelector("#toast-container"));
    this.modal = new ModalManager(document.querySelector("#modal-overlay"), this.audio);
    this.router = new Router(document.querySelector("#screen-container"));
    this.registerScreens();
    this.bindGlobalShortcuts();
    this.go("menu");
  }

  registerScreens() {
    const context = this;
    this.router.register("menu", new MenuScreen(context));
    this.router.register("game", new GameScreen(context));
    this.router.register("result", new ResultScreen(context));
    this.router.register("tutorial", new TutorialScreen(context));
    this.router.register("settings", new SettingsScreen(context));
  }

  go(screenName, params = {}) {
    this.audio.playBgm(screenName, params.settings?.difficulty ?? this.state.getSettings().difficulty);
    return this.router.navigate(screenName, params);
  }

  applySettings(patch) {
    const settings = this.state.updateSettings(patch);
    this.theme.apply();
    this.audio.refreshSettings();
    this.events.emit("settings:changed", settings);
    return settings;
  }

  showToast(message, type = "info") {
    this.toast.show(message, type);
  }

  openModal(options) {
    return this.modal.open(options);
  }

  closeModal(value) {
    this.modal.close(value);
  }

  bindGlobalShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        this.go("tutorial");
      }
      if (event.key.toLowerCase() === "m" && !event.ctrlKey && !event.metaKey) {
        if (this.router?.currentName === "game") return;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (["input", "textarea", "select"].includes(activeTag)) return;
        this.audio.toggleMute();
        this.showToast(this.audio.muted ? "音效已靜音" : "音效已恢復", "info");
      }
    });
  }
}
