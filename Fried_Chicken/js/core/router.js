(function (global) {
  "use strict";
  var CCC = global.CCC;

  function showPauseDialog() {
    var session = CCC.state.session;
    if (!session || session.finished || CCC.state.screen !== "game") { return; }
    session.pause("manual");
    CCC.ui.components.openDialog({
      title: CCC.i18n.t("pause.title"),
      bodyHtml: '<div class="stack"><p>' + CCC.i18n.t("common.day", { day: session.day }) + ' · ' + CCC.i18n.t("game.revenue") + ' ' + CCC.i18n.number(session.revenue) + ' / ' + CCC.i18n.number(session.level.goal) + '</p></div>',
      actions: [
        { label: CCC.i18n.t("pause.continue"), className: "btn btn--accent", value: "resume", autofocus: true },
        { label: CCC.i18n.t("pause.restart"), className: "btn btn--secondary", value: "restart" },
        { label: CCC.i18n.t("pause.settings"), className: "btn btn--secondary", value: "settings" },
        { label: CCC.i18n.t("pause.home"), className: "btn btn--danger", value: "home" }
      ],
      onClose: function (value) {
        if (value === "restart") { setTimeout(confirmRestart, 0); }
        else if (value === "settings") { CCC.router.go("settings", { fromPause: true }); }
        else if (value === "home") { setTimeout(confirmHome, 0); }
        else if (CCC.state.screen === "game" && !CCC.state.pausedByLifecycle) { session.resume("manual"); }
      }
    });
  }

  function confirmRestart() {
    var session = CCC.state.session;
    if (!session) { return; }
    CCC.ui.components.openDialog({
      title: CCC.i18n.t("pause.restartTitle"), body: CCC.i18n.t("pause.restartBody"),
      actions: [
        { label: CCC.i18n.t("common.cancel"), className: "btn btn--secondary", value: "cancel" },
        { label: CCC.i18n.t("common.confirm"), className: "btn btn--danger", value: "confirm" }
      ],
      onClose: function (value) {
        if (value === "confirm") { CCC.router.startGame(session.day); }
        else { setTimeout(showPauseDialog, 0); }
      }
    });
  }

  function confirmHome() {
    var session = CCC.state.session;
    if (!session) { return; }
    CCC.ui.components.openDialog({
      title: CCC.i18n.t("pause.homeTitle"), body: CCC.i18n.t("pause.homeBody"),
      actions: [
        { label: CCC.i18n.t("common.cancel"), className: "btn btn--secondary", value: "cancel" },
        { label: CCC.i18n.t("pause.home"), className: "btn btn--danger", value: "confirm" }
      ],
      onClose: function (value) {
        if (value === "confirm") { session.stop(); CCC.state.session = null; CCC.router.go("home"); }
        else { setTimeout(showPauseDialog, 0); }
      }
    });
  }

  function route(screen, options) {
    var previous = CCC.state.screen;
    options = options || {};
    if (previous === "game" && screen !== "game" && screen !== "settings" && screen !== "result" && CCC.state.session) {
      CCC.state.session.stop();
      CCC.state.session = null;
    }
    CCC.state.previousScreen = previous;
    CCC.state.screen = screen;
    var renderer = CCC.ui.screens[screen];
    if (!renderer) { screen = "home"; CCC.state.screen = "home"; renderer = CCC.ui.screens.home; }
    renderer(options);
  }

  function startGame(day) {
    if (CCC.state.session) { CCC.state.session.stop(); }
    var session = new CCC.game.GameSession(day);
    CCC.state.session = session;
    CCC.state.selectedDay = day;
    route("game", { newSession: true });
    var seen = CCC.state.progress.tutorialsSeen[day];
    if (seen) { session.start(); return; }
    CCC.ui.components.openDialog({
      title: CCC.i18n.t("tutorial.title"),
      bodyHtml: '<div class="hint-box"><strong>🐥 ' + CCC.i18n.t("briefing.tip") + '</strong><span>' + CCC.i18n.t(session.level.tutorial) + '</span></div>',
      dismissible: true,
      actions: [{ label: CCC.i18n.t("tutorial.begin"), className: "btn btn--accent", value: "start", autofocus: true }],
      onClose: function () {
        CCC.state.progress.tutorialsSeen[day] = true;
        CCC.storage.saveProgress();
        if (!session.running && !session.finished) { session.start(); }
      }
    });
  }

  CCC.router = {
    go: route,
    startGame: startGame,
    togglePause: function () {
      var session = CCC.state.session;
      if (!session || session.finished || CCC.state.screen !== "game" || CCC.state.dialogOpen) { return; }
      showPauseDialog();
    }
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && CCC.state.screen === "game" && !CCC.state.dialogOpen) {
      if (document.fullscreenElement) { return; }
      event.preventDefault();
      CCC.router.togglePause();
    }
  });
}(typeof window !== "undefined" ? window : globalThis));
