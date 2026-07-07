(function initModalController(global) {
  const CF = global.CF || (global.CF = {});

  function show(options) {
    const root = document.getElementById("modal-root");
    if (!root) return;
    const actions = (options.actions || []).map((action) => {
      return `<button class="button ${action.className || ""}" type="button" data-modal-action="${action.action}">${CF.helpers.escapeHtml(action.label)}</button>`;
    }).join("");

    root.innerHTML = `
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="top-bar">
          <h2 id="modal-title">${CF.helpers.escapeHtml(options.title)}</h2>
          <button class="icon-button" type="button" data-modal-action="close" aria-label="${CF.i18n.t("common.close")}">
            <img class="icon-img" src="assets/icons/icon-close.svg" alt="">
          </button>
        </div>
        <div>${options.body || ""}</div>
        <div class="modal-actions">${actions}</div>
      </section>
    `;
    const closeButton = root.querySelector("[data-modal-action='close']");
    if (closeButton) closeButton.focus();
  }

  function hide() {
    const root = document.getElementById("modal-root");
    if (root) root.innerHTML = "";
  }

  CF.modalController = { show, hide };
})(window);
