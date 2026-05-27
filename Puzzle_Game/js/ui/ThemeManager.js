import { THEMES } from "../utils/constants.js";

export class ThemeManager {
  constructor(appState) {
    this.state = appState;
  }

  apply(themeId = this.state.settings.theme, appearance = this.state.settings.appearance) {
    const known = THEMES.map((theme) => theme.id);
    const modes = ["mode-light", "mode-dark"];
    document.body.classList.remove(...known);
    document.body.classList.remove(...modes);
    document.body.classList.add(themeId);
    document.body.classList.add(`mode-${appearance || "light"}`);
  }

  set(themeId) {
    this.state.setSettings({ theme: themeId });
    this.apply(themeId);
  }

  setAppearance(appearance) {
    this.state.setSettings({ appearance });
    this.apply(this.state.settings.theme, appearance);
  }
}
