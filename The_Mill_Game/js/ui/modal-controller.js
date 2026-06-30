(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var backdrop;
  var title;
  var body;
  var confirmButton;
  var cancelButton;
  var onConfirm = null;

  function close() {
    backdrop.hidden = true;
    onConfirm = null;
  }

  function show(options) {
    title.textContent = options.title || "";
    body.textContent = options.body || "";
    confirmButton.textContent = options.confirmText || NMM.I18n.t("modal_confirm");
    cancelButton.textContent = options.cancelText || NMM.I18n.t("modal_cancel");
    onConfirm = typeof options.onConfirm === "function" ? options.onConfirm : null;
    backdrop.hidden = false;
    confirmButton.focus();
  }

  function init() {
    backdrop = document.getElementById("modal-backdrop");
    title = document.getElementById("modal-title");
    body = document.getElementById("modal-body");
    confirmButton = document.getElementById("modal-confirm");
    cancelButton = document.getElementById("modal-cancel");
    confirmButton.addEventListener("click", function () {
      var handler = onConfirm;
      close();
      if (handler) {
        handler();
      }
    });
    cancelButton.addEventListener("click", close);
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) {
        close();
      }
    });
  }

  NMM.Modal = {
    init: init,
    show: show,
    close: close
  };
})(window);
