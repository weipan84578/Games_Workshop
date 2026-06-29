(function () {
  "use strict";

  var selectedDifficulty = "normal";

  function overlay() {
    return document.getElementById("modal-overlay");
  }

  function content() {
    return document.getElementById("modal-content");
  }

  function close() {
    overlay().classList.add("hidden");
    overlay().setAttribute("aria-hidden", "true");
    content().innerHTML = "";
  }

  function show(html) {
    content().innerHTML = html;
    overlay().classList.remove("hidden");
    overlay().setAttribute("aria-hidden", "false");
    var firstButton = content().querySelector("button");
    if (firstButton) firstButton.focus();
  }

  function difficultyOption(id, label, desc, mark) {
    return [
      '<button class="difficulty-option' + (id === selectedDifficulty ? " selected" : "") + '" type="button" data-difficulty="' + id + '">',
      '<span class="difficulty-icon">' + mark + '</span>',
      '<span><strong>' + label + '</strong><br><small>' + desc + '</small></span>',
      '</button>'
    ].join("");
  }

  function showDifficulty(onConfirm) {
    selectedDifficulty = "normal";
    show([
      '<div class="modal-body">',
      '<h2>' + window.I18n.t("difficulty.title") + '</h2>',
      '<div class="difficulty-list">',
      difficultyOption("easy", window.I18n.t("difficulty.easy"), window.I18n.t("difficulty.easyDesc"), "E"),
      difficultyOption("normal", window.I18n.t("difficulty.normal"), window.I18n.t("difficulty.normalDesc"), "N"),
      difficultyOption("hard", window.I18n.t("difficulty.hard"), window.I18n.t("difficulty.hardDesc"), "H"),
      '</div>',
      '<div class="modal-actions">',
      '<button class="btn btn-secondary" type="button" data-modal-cancel>' + window.I18n.t("difficulty.cancel") + '</button>',
      '<button class="btn btn-primary" type="button" data-modal-confirm>' + window.I18n.t("difficulty.confirm") + '</button>',
      '</div>',
      '</div>'
    ].join(""));

    content().querySelectorAll("[data-difficulty]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedDifficulty = button.getAttribute("data-difficulty");
        content().querySelectorAll("[data-difficulty]").forEach(function (node) {
          node.classList.toggle("selected", node === button);
        });
      });
    });
    content().querySelector("[data-modal-cancel]").addEventListener("click", close);
    content().querySelector("[data-modal-confirm]").addEventListener("click", function () {
      close();
      onConfirm(selectedDifficulty);
    });
  }

  function confirm(message, onConfirm) {
    show([
      '<div class="modal-body">',
      '<h2>' + message + '</h2>',
      '<div class="modal-actions">',
      '<button class="btn btn-secondary" type="button" data-modal-cancel>' + window.I18n.t("common.cancel") + '</button>',
      '<button class="btn btn-primary" type="button" data-modal-confirm>' + window.I18n.t("common.ok") + '</button>',
      '</div>',
      '</div>'
    ].join(""));
    content().querySelector("[data-modal-cancel]").addEventListener("click", close);
    content().querySelector("[data-modal-confirm]").addEventListener("click", function () {
      close();
      onConfirm();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !overlay().classList.contains("hidden")) close();
  });

  window.Modal = {
    showDifficulty: showDifficulty,
    confirm: confirm,
    close: close
  };
})();
