(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  app.MainMenuUI = {
    updateContinue: function () {
      var button = document.getElementById("continue-button");
      if (!button) return;
      var hasSave = app.GameState.hasSave();
      button.disabled = !hasSave;
      button.title = hasSave ? app.I18n.t("menu.continue") : app.I18n.t("menu.noSave");
      var label = document.getElementById("current-language-label");
      if (label) label.textContent = app.I18n.languageNames[app.I18n.getLanguage()];
    },
    renderLanguageMenu: function () {
      var menu = document.getElementById("language-menu");
      if (!menu) return;
      menu.innerHTML = app.I18n.supported.map(function (language) {
        var active = language === app.I18n.getLanguage();
        return '<button type="button" class="language-option ' + (active ? "is-active" : "") + '" data-action="set-language" data-language="' + language + '">' + (language === "zh-TW" ? "🇹🇼" : language === "en" ? "🇺🇸" : "🇯🇵") + " " + app.I18n.t("settings.languages." + language) + "</button>";
      }).join("");
      this.updateContinue();
    }
  };
}(window));
