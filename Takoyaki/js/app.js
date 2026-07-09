(function bootTakoyaki() {
  "use strict";

  const appScriptUrl = document.currentScript?.src || new URL('./js/app.js', document.baseURI).href;
  const scripts = [
    "./core/config.js",
    "./core/event-bus.js",
    "./core/storage.js",
    "./core/state.js",
    "./i18n/lang-zh.js",
    "./i18n/lang-en.js",
    "./i18n/lang-jp.js",
    "./i18n/i18n-engine.js",
    "./audio/playlist.js",
    "./audio/audio-manager.js",
    "./ui/screen-manager.js",
    "./ui/mobile-controls.js",
    "./game/ingredients.js",
    "./game/scoring.js",
    "./game/takoyaki-slot.js",
    "./game/order-system.js",
    "./game/animations.js",
    "./game/game-loop.js",
    "./ui/main-menu.js",
    "./ui/howto-page.js",
    "./ui/settings-page.js"
  ];

  function loadScript(relativePath) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(relativePath, appScriptUrl).href;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${relativePath}`));
      document.head.append(script);
    });
  }

  function applyTheme(themeClass) {
    const validThemes = window.Takoyaki.Config.themes.map((theme) => theme.id);
    document.body.classList.remove(...validThemes);
    document.body.classList.add(validThemes.includes(themeClass) ? themeClass : "theme-cute-pink");
  }

  async function boot() {
    for (const script of scripts) {
      await loadScript(script);
    }
    const app = window.Takoyaki;
    app.ApplyTheme = applyTheme;
    app.I18n.init(app.State.get().settings);
    applyTheme(app.State.get().settings.theme);
    app.AudioManager.preload();
    app.MainMenu.render();
    app.ScreenManager.show("main-menu");
    app.EventBus.on("settings:changed", (settings) => {
      applyTheme(settings.theme);
      app.AudioManager.setVolumes(settings);
    });
    window.addEventListener("orientationchange", () => {
      window.setTimeout(() => {
        app.GameLoop.rerender();
        app.MobileControls.rerender();
      }, 120);
    });
  }

  boot().catch((error) => {
    const root = document.getElementById("screen-main-menu");
    root.classList.add("is-active");
    root.textContent = error.message;
  });
})();
