(function (ns) {
  "use strict";

  function ScreenManager() {
    this.current = "menu";
    this.locked = false;
    this.toastTimer = 0;
  }

  ScreenManager.prototype.show = function (name) {
    this.locked = true;
    this.current = name;
    ns.Helpers.$$(".screen").forEach(function (screen) {
      screen.classList.toggle("screen-active", screen.getAttribute("data-screen") === name);
    });
    var self = this;
    window.setTimeout(function () {
      self.locked = false;
    }, 240);
  };

  ScreenManager.prototype.showModal = function (id) {
    var modal = ns.Helpers.$("#" + id);
    if (modal) {
      modal.classList.remove("is-hidden");
    }
  };

  ScreenManager.prototype.hideModal = function (id) {
    var modal = ns.Helpers.$("#" + id);
    if (modal) {
      modal.classList.add("is-hidden");
    }
  };

  ScreenManager.prototype.hideAllModals = function () {
    ns.Helpers.$$(".modal").forEach(function (modal) {
      modal.classList.add("is-hidden");
    });
  };

  ScreenManager.prototype.toast = function (message) {
    var toast = ns.Helpers.$("#toast");
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1500);
  };

  ns.ScreenManager = ScreenManager;
})(window.AirHockey = window.AirHockey || {});
