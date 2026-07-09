(function registerScreenManager(app) {
  "use strict";

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  app.ScreenManager = {
    show(screenName) {
      document.querySelectorAll("[data-screen-panel]").forEach((screen) => {
        screen.classList.toggle("is-active", screen.dataset.screenPanel === screenName);
      });
      app.State.setScreen(screenName);
      if (screenName !== "game") {
        app.AudioManager.playBgm("menu");
      }
    },

    confirm(options) {
      const modalRoot = document.getElementById("modal-root");
      const showCancel = options.cancelKey !== null;
      modalRoot.className = "modal-root is-open";
      modalRoot.innerHTML = `
        <div class="modal-backdrop" data-modal-cancel></div>
        <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title">${t(options.titleKey, options.titleParams)}</h2>
          <p>${t(options.bodyKey, options.bodyParams)}</p>
          <div class="modal-actions">
            ${showCancel ? `<button class="btn btn-quiet" type="button" data-modal-cancel>${t(options.cancelKey || "action_cancel")}</button>` : ""}
            <button class="btn ${options.danger ? "btn-danger" : ""}" type="button" data-modal-confirm>${t(options.confirmKey || "action_confirm")}</button>
          </div>
        </section>
      `;
      return new Promise((resolve) => {
        const close = (answer) => {
          modalRoot.className = "modal-root";
          modalRoot.innerHTML = "";
          resolve(answer);
        };
        modalRoot.querySelectorAll("[data-modal-cancel]").forEach((element) => {
          element.addEventListener("click", () => {
            app.AudioManager.playSfx("button");
            close(false);
          });
        });
        modalRoot.querySelector("[data-modal-confirm]").addEventListener("click", () => {
          app.AudioManager.playSfx("button");
          close(true);
        });
        modalRoot.querySelector("[data-modal-confirm]").focus();
      });
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
