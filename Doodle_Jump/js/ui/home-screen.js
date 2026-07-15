(function (Game) {
  "use strict";
  function HomeScreen(root, callbacks) {
    this.root = root;
    this.callbacks = callbacks || {};
    this.start = root.querySelector("#start-game-button");
    this.continueButton = root.querySelector("#continue-game-button");
    this.bind();
  }
  HomeScreen.prototype.bind = function () {
    var self = this;
    this.start.addEventListener("click", function () {
      self.callbacks.start && self.callbacks.start();
    });
    this.continueButton.addEventListener("click", function () {
      if (!self.continueButton.disabled && self.callbacks.continue)
        self.callbacks.continue();
    });
    rootButton(this.root, "#open-help-button", this.callbacks.help);
    rootButton(this.root, "#open-settings-button", this.callbacks.settings);
    rootButton(
      this.root,
      "#open-leaderboard-button",
      this.callbacks.leaderboard,
    );
  };
  HomeScreen.prototype.updateSave = function (snapshot) {
    var summary = this.root.querySelector("#save-summary");
    if (!snapshot) {
      this.continueButton.disabled = true;
      this.continueButton.title = Game.I18n.t("home.noSave");
      summary.hidden = true;
      summary.textContent = "";
      return;
    }
    this.continueButton.disabled = false;
    summary.hidden = false;
    summary.textContent = Game.I18n.t("home.saveSummary", {
      height: Game.I18n.number(snapshot.score.maxHeight || 0),
      score: Game.I18n.number(snapshot.score.total || 0),
    });
  };
  function rootButton(root, selector, callback) {
    var button = root.querySelector(selector);
    if (button) button.addEventListener("click", callback || function () {});
  }
  Game.HomeScreen = HomeScreen;
})(window.DJGame);
