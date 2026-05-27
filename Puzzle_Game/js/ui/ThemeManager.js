import { THEMES } from "../utils/constants.js";

export class ThemeManager {
  constructor(appState) {
    this.state = appState;
  }

  apply(themeId = this.state.settings.theme) {
    const known = THEMES.map((theme) => theme.id);
    document.body.classList.remove(...known);
    document.body.classList.add(themeId);
  }

  set(themeId) {
    this.state.setSettings({ theme: themeId });
    this.apply(themeId);
  }
}
