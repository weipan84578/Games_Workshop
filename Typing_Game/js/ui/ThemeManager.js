export class ThemeManager {
  constructor(state) {
    this.state = state;
  }

  apply() {
    const settings = this.state.getSettings();
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.fontSize = settings.fontSize;
    document.documentElement.dataset.animation = String(settings.animation);
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg-primary").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg || "#0d1117");
  }
}
