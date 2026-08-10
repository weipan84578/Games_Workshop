(function (global) {
  "use strict";
  var CCC = global.CCC;

  function fatal(error) {
    var boot = document.getElementById("boot-screen");
    var panel = document.getElementById("core-error");
    if (boot) { boot.classList.add("is-done"); }
    if (panel) { panel.hidden = false; }
    if (global.console) { console.error(error); }
  }

  function applyPreferences() {
    var pref = CCC.state.preferences;
    document.documentElement.dataset.theme = pref.theme;
    document.documentElement.classList.toggle("reduce-motion", pref.reduceMotion);
    var language = pref.language || CCC.i18n.detect();
    pref.language = language;
    CCC.i18n.setLanguage(language, false);
  }

  function start() {
    try {
      var required = [CCC.storage, CCC.i18n, CCC.data, CCC.audio, CCC.ui && CCC.ui.screens, CCC.router];
      if (required.some(function (item) { return !item; })) { throw new Error("A required game script did not load."); }
      CCC.storage.init();
      applyPreferences();
      CCC.ui.screens.init(document.getElementById("app"));
      CCC.lifecycle.init();

      var boot = document.getElementById("boot-screen");
      var bootTitle = boot.querySelector("h1");
      var bootText = boot.querySelector("p");
      bootTitle.textContent = CCC.i18n.t("app.title");
      bootText.textContent = CCC.i18n.t("app.loading");

      CCC.router.go("home");
      setTimeout(function () {
        boot.classList.add("is-done");
        document.getElementById("app").focus();
        if (!CCC.state.storageAvailable) { CCC.ui.components.toast(CCC.i18n.t("storage.unavailable"), "error"); }
      }, 480);

      function firstGesture() {
        CCC.audio.initFromGesture();
        document.removeEventListener("pointerdown", firstGesture, true);
        document.removeEventListener("keydown", firstGesture, true);
      }
      document.addEventListener("pointerdown", firstGesture, true);
      document.addEventListener("keydown", firstGesture, true);

      CCC.events.on("storageerror", function () { CCC.ui.components.toast(CCC.i18n.t("storage.unavailable"), "error"); });
      CCC.events.on("audioerror", function () { CCC.ui.components.toast(CCC.i18n.t("audio.unavailable"), "error"); });
      document.addEventListener("fullscreenchange", function () {
        CCC.state.preferences.fullscreenPreferred = CCC.fullscreen.active();
        CCC.storage.savePreferences();
      });
    } catch (error) { fatal(error); }
  }

  global.addEventListener("error", function (event) {
    if (CCC.state.screen === "boot") { fatal(event.error || event.message); }
  });
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
}(typeof window !== "undefined" ? window : globalThis));
