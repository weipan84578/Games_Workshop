(function (Game) {
  "use strict";
  function Modal(root, i18n) {
    this.root = root;
    this.i18n = i18n;
    this.active = null;
  }
  Modal.prototype.confirm = function (options) {
    var self = this;
    options = options || {};
    if (this.active) this.close(false);
    return new Promise(function (resolve) {
      var backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop";
      var dialog = document.createElement("div");
      dialog.className = "modal-card";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      var title = document.createElement("h2");
      title.textContent = options.title || self.i18n.t("modal.confirmTitle");
      var body = document.createElement("p");
      body.textContent = options.body || "";
      var actions = document.createElement("div");
      actions.className = "modal-actions";
      var cancel = document.createElement("button");
      cancel.className = "button button-quiet";
      cancel.type = "button";
      cancel.textContent = options.cancelText || self.i18n.t("modal.no");
      var ok = document.createElement("button");
      ok.className = "button button-primary";
      ok.type = "button";
      ok.textContent = options.confirmText || self.i18n.t("modal.ok");
      actions.appendChild(cancel);
      actions.appendChild(ok);
      dialog.appendChild(title);
      dialog.appendChild(body);
      dialog.appendChild(actions);
      backdrop.appendChild(dialog);
      self.root.appendChild(backdrop);
      self.active = {
        backdrop: backdrop,
        resolve: resolve,
        previous: document.activeElement,
      };
      function finish(value) {
        if (!self.active) return;
        var previous = self.active.previous;
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        self.active = null;
        if (previous && previous.focus) previous.focus();
        resolve(value);
      }
      cancel.addEventListener("click", function () {
        finish(false);
      });
      ok.addEventListener("click", function () {
        finish(true);
      });
      backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) finish(false);
      });
      dialog.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(false);
        }
        if (event.key === "Tab") {
          var focusables = dialog.querySelectorAll("button");
          if (
            focusables.length &&
            event.shiftKey &&
            document.activeElement === focusables[0]
          ) {
            event.preventDefault();
            focusables[focusables.length - 1].focus();
          } else if (
            focusables.length &&
            !event.shiftKey &&
            document.activeElement === focusables[focusables.length - 1]
          ) {
            event.preventDefault();
            focusables[0].focus();
          }
        }
      });
      ok.focus();
    });
  };
  Modal.prototype.close = function (value) {
    if (this.active) {
      var current = this.active;
      if (current.backdrop.parentNode)
        current.backdrop.parentNode.removeChild(current.backdrop);
      this.active = null;
      current.resolve(Boolean(value));
    }
  };
  Game.Modal = Modal;
})(window.DJGame);
