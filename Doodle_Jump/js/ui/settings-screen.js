(function (Game) {
  "use strict";
  function getPath(object, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key];
    }, object);
  }
  function setPath(object, path, value) {
    var parts = path.split(".");
    var target = object;
    parts.slice(0, -1).forEach(function (key) {
      target = target[key];
    });
    target[parts[parts.length - 1]] = value;
  }
  function SettingsScreen(root, callbacks) {
    this.root = root;
    this.callbacks = callbacks || {};
    this.form = root.querySelector("#settings-form");
    this.bound = false;
    this.bind();
  }
  SettingsScreen.prototype.bind = function () {
    if (this.bound) return;
    this.bound = true;
    var self = this;
    this.form.querySelectorAll("[data-setting]").forEach(function (control) {
      var event =
        control.type === "range" || control.type === "checkbox"
          ? "input"
          : "change";
      control.addEventListener(event, function () {
        self.change(control);
      });
    });
    this.form.querySelectorAll("[data-control]").forEach(function (control) {
      control.addEventListener("change", function () {
        self.changeControl(control);
      });
    });
    this.form
      .querySelector("#preview-sfx")
      .addEventListener("click", function () {
        self.callbacks.previewSfx && self.callbacks.previewSfx();
      });
    this.form
      .querySelector("#preview-bgm")
      .addEventListener("click", function () {
        self.callbacks.previewBgm && self.callbacks.previewBgm();
      });
    this.form
      .querySelector("#tilt-toggle")
      .addEventListener("change", function () {
        if (this.checked && self.callbacks.enableTilt)
          self.callbacks.enableTilt();
      });
    [
      "clear-save-button",
      "clear-board-button",
      "reset-settings-button",
    ].forEach(function (id) {
      var button = self.root.querySelector("#" + id);
      if (button)
        button.addEventListener("click", function () {
          self.callbacks[id] && self.callbacks[id]();
        });
    });
  };
  SettingsScreen.prototype.render = function (settings) {
    var self = this;
    this.form.querySelectorAll("[data-setting]").forEach(function (control) {
      var value = getPath(settings, control.getAttribute("data-setting"));
      if (control.type === "checkbox") control.checked = Boolean(value);
      else control.value = String(value);
      var output = self.form.querySelector(
        '[data-output-for="' + control.getAttribute("data-setting") + '"]',
      );
      if (output) output.textContent = String(value);
    });
    this.form.querySelectorAll("[data-control]").forEach(function (control) {
      control.value = settings.controls[control.getAttribute("data-control")];
    });
    this.updateTouchLabel(settings);
  };
  SettingsScreen.prototype.change = function (control) {
    var path = control.getAttribute("data-setting");
    var value;
    if (control.type === "checkbox") value = control.checked;
    else if (control.type === "range") value = Number(control.value);
    else value = control.value;
    var settings = Game.SettingsStore.load();
    setPath(settings, path, value);
    if (path === "language" && this.callbacks.language)
      this.callbacks.language(value);
    if (path === "theme" && this.callbacks.theme) this.callbacks.theme(value);
    if (path === "controls.tiltEnabled" && !value && this.callbacks.disableTilt)
      this.callbacks.disableTilt();
    var result = Game.SettingsStore.save(settings);
    var output = this.form.querySelector('[data-output-for="' + path + '"]');
    if (output) output.textContent = String(value);
    this.updateTouchLabel(settings);
    if (this.callbacks.changed) this.callbacks.changed(settings, result);
  };
  SettingsScreen.prototype.changeControl = function (control) {
    var settings = Game.SettingsStore.load();
    settings.controls[control.getAttribute("data-control")] =
      control.value.trim();
    var message = this.root.querySelector("#key-conflict-message");
    var values = [
      settings.controls.leftKey,
      settings.controls.rightKey,
      settings.controls.pauseKey,
    ];
    var names = ["leftKey", "rightKey", "pauseKey"];
    var duplicate = null;
    values.forEach(function (value, index) {
      if (duplicate) return;
      var other = values.indexOf(value);
      if (other !== index)
        duplicate = { value: value, first: names[other], second: names[index] };
    });
    if (duplicate) {
      message.textContent = Game.I18n.t("errors.keyConflict", {
        key: duplicate.value,
        first: duplicate.first,
        second: duplicate.second,
      });
      this.render(Game.SettingsStore.load());
      return;
    }
    message.textContent = "";
    Game.SettingsStore.save(settings);
    if (this.callbacks.changed) this.callbacks.changed(settings, { ok: true });
  };
  SettingsScreen.prototype.updateTouchLabel = function (settings) {
    var controls = this.root.querySelector("#touch-controls");
    if (controls)
      controls.classList.toggle(
        "is-swapped",
        settings.controls.swapTouchButtons,
      );
  };
  Game.SettingsScreen = SettingsScreen;
})(window.DJGame);
