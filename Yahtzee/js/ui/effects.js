window.YZ = window.YZ || {};

YZ.Effects = (function () {
  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function die(value, className) {
    var face = YZ.Constants.DIE_FACES[value] || "?";
    return '<span class="die ' + esc(className || "") + '" data-value="' + esc(value || 0) + '" data-face="' + esc(face) + '"></span>';
  }

  function diceSample(values) {
    return '<span class="dice-sample">' + values.map(function (value) {
      return die(value);
    }).join("") + "</span>";
  }

  function scoreIcon(key) {
    var meta = YZ.Scoring && YZ.Scoring.categoryMeta ? YZ.Scoring.categoryMeta(key) : null;
    var icon = meta && meta.icon ? meta.icon : "?";
    return '<span class="score-icon score-icon--' + esc(key) + '" aria-hidden="true">' + esc(icon) + "</span>";
  }

  function closeModal() {
    var root = document.getElementById("modal-root");
    if (root) root.innerHTML = "";
  }

  function modal(title, body, actions) {
    return new Promise(function (resolve) {
      var root = document.getElementById("modal-root");
      var actionHtml = actions.map(function (action, index) {
        return '<button class="btn ' + esc(action.className || "") + '" data-modal-action="' + index + '">' + esc(action.label) + "</button>";
      }).join("");
      root.innerHTML = [
        '<div class="modal-backdrop" role="presentation">',
        '<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">',
        '<div class="modal__body">',
        '<h2 id="modal-title">' + esc(title) + "</h2>",
        '<p class="muted">' + esc(body) + "</p>",
        "</div>",
        '<div class="modal__actions">' + actionHtml + "</div>",
        "</section>",
        "</div>"
      ].join("");
      root.querySelectorAll("[data-modal-action]").forEach(function (button) {
        button.addEventListener("click", function () {
          var action = actions[Number(button.getAttribute("data-modal-action"))];
          closeModal();
          resolve(action.value);
        });
      });
    });
  }

  function confirm(title, body) {
    return modal(title, body, [
      { label: YZ.I18n.t("common.cancel"), value: false, className: "btn--ghost" },
      { label: YZ.I18n.t("common.confirm"), value: true, className: "btn--primary" }
    ]);
  }

  function choice(title, body, choices) {
    return modal(title, body || "", choices.map(function (choiceItem) {
      return {
        label: choiceItem.label,
        value: choiceItem.value,
        className: choiceItem.className || "btn--secondary"
      };
    }));
  }

  function toast(message) {
    var root = document.getElementById("toast-root");
    if (!root) return;
    root.innerHTML = '<div class="toast">' + esc(message) + "</div>";
    setTimeout(function () {
      root.innerHTML = "";
    }, 1800);
  }

  return {
    esc: esc,
    die: die,
    diceSample: diceSample,
    scoreIcon: scoreIcon,
    closeModal: closeModal,
    modal: modal,
    confirm: confirm,
    choice: choice,
    toast: toast
  };
})();
