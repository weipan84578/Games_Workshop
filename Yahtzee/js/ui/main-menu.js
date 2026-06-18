window.YZ = window.YZ || {};

YZ.MainMenu = (function () {
  function t(key, args) {
    return YZ.I18n.t(key, args);
  }

  function difficultyButtons() {
    return YZ.Constants.DIFFICULTIES.map(function (difficulty) {
      return {
        label: t("difficulty." + difficulty),
        value: difficulty,
        className: difficulty === "hard" ? "btn--primary" : "btn--secondary"
      };
    });
  }

  async function chooseDifficulty() {
    return YZ.Effects.choice(t("menu.selectDifficulty"), t("difficulty.normalDesc"), difficultyButtons());
  }

  async function startGame() {
    YZ.Audio.unlock();
    if (YZ.Save.exists()) {
      var ok = await YZ.Effects.confirm(t("menu.overwriteTitle"), t("menu.overwriteBody"));
      if (!ok) return;
    }
    var difficulty = await chooseDifficulty();
    if (!difficulty) return;
    YZ.Game.newGame(difficulty);
    YZ.ScreenManager.show("game");
  }

  function continueGame() {
    YZ.Audio.unlock();
    if (!YZ.Game.loadGame()) return;
    YZ.Effects.toast(t("game.loaded"));
    YZ.ScreenManager.show("game");
    YZ.Game.resumeIfNeeded();
  }

  function render() {
    var root = document.getElementById("screen-menu");
    if (!root) return;
    var hasSave = YZ.Save.exists();
    root.innerHTML = [
      '<div class="menu-shell page-shell">',
      '<section class="menu-board surface">',
      '<div class="menu-brand">',
      '<div class="menu-logo-row">',
      '<div class="menu-logo" aria-hidden="true">⚂</div>',
      '<div><h1>' + YZ.Effects.esc(t("app.title")) + '</h1><div class="app-badge">' + YZ.Effects.esc(t("app.version")) + "</div></div>",
      "</div>",
      '<p class="menu-subtitle">' + YZ.Effects.esc(t("app.subtitle")) + "</p>",
      '<p class="save-note">' + YZ.Effects.esc(hasSave ? t("menu.hasSave") : t("menu.noSave")) + "</p>",
      "</div>",
      '<div class="menu-actions">',
      '<button class="btn btn--primary btn--wide" id="menu-start">▶ ' + YZ.Effects.esc(t("menu.start")) + "</button>",
      '<button class="btn btn--wide ' + (hasSave ? "" : "is-disabled") + '" id="menu-continue" ' + (hasSave ? "" : "disabled") + '>⏵ ' + YZ.Effects.esc(t("menu.continue")) + "</button>",
      '<button class="btn btn--wide" id="menu-instructions">📖 ' + YZ.Effects.esc(t("menu.instructions")) + "</button>",
      '<button class="btn btn--wide" id="menu-settings">⚙ ' + YZ.Effects.esc(t("menu.settings")) + "</button>",
      "</div>",
      '<div class="menu-footer">',
      '<div class="quick-group"><span class="muted">' + YZ.Effects.esc(t("menu.quickLang")) + '</span><div class="segmented">',
      langButton("zh", "繁中") + langButton("en", "EN") + langButton("ja", "日本語"),
      "</div></div>",
      '<div class="quick-group"><span class="muted">' + YZ.Effects.esc(t("menu.quickTheme")) + '</span><div class="swatch-row">',
      YZ.Constants.THEMES.map(function (theme) {
        return '<button class="theme-swatch ' + (YZ.Settings.get("theme") === theme ? "is-active" : "") + '" data-theme="' + theme + '" aria-label="' + theme + '"></button>';
      }).join(""),
      "</div></div>",
      "</div>",
      "</section>",
      "</div>"
    ].join("");

    root.querySelector("#menu-start").addEventListener("click", startGame);
    root.querySelector("#menu-continue").addEventListener("click", continueGame);
    root.querySelector("#menu-instructions").addEventListener("click", function () { YZ.ScreenManager.show("instructions"); });
    root.querySelector("#menu-settings").addEventListener("click", function () { YZ.ScreenManager.show("settings"); });
    root.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        YZ.Settings.set("lang", button.getAttribute("data-lang"));
        YZ.I18n.set(button.getAttribute("data-lang"));
      });
    });
    root.querySelectorAll("[data-theme]").forEach(function (button) {
      button.addEventListener("click", function () {
        YZ.Settings.set("theme", button.getAttribute("data-theme"));
        render();
      });
    });
  }

  function langButton(lang, label) {
    return '<button class="btn ' + (YZ.I18n.get() === lang ? "is-active" : "") + '" data-lang="' + lang + '">' + label + "</button>";
  }

  return {
    render: render
  };
})();
