(function () {
  const overlay = () => Helpers.qs("#modal-overlay");
  const content = () => Helpers.qs("#modal-content");

  const Modal = {
    open(html) {
      content().innerHTML = html;
      overlay().hidden = false;
    },

    close() {
      overlay().hidden = true;
      content().innerHTML = "";
    },

    promptChoice(title, options, cancelLabel) {
      return new Promise((resolve) => {
        const buttons = options
          .map((option) => {
            const extra = option.color ? `data-color="${option.color}"` : "";
            return `<button class="btn ${option.className || ""}" type="button" data-modal-value="${Helpers.escapeHtml(option.value)}" ${extra}>${option.label}</button>`;
          })
          .join("");
        this.open(`
          <h2 class="modal-title">${title}</h2>
          <div class="modal-actions ${options.length === 4 ? "color-choice-grid" : ""}">
            ${buttons}
            <button class="btn btn-ghost" type="button" data-modal-cancel>${cancelLabel || I18n.t("common.cancel")}</button>
          </div>
        `);
        const onClick = (event) => {
          const choice = event.target.closest("[data-modal-value]");
          const cancel = event.target.closest("[data-modal-cancel]");
          if (!choice && !cancel) return;
          content().removeEventListener("click", onClick);
          const value = choice ? choice.dataset.modalValue : null;
          this.close();
          resolve(value);
        };
        content().addEventListener("click", onClick);
      });
    },

    confirm(message) {
      return new Promise((resolve) => {
        this.open(`
          <h2 class="modal-title">${message}</h2>
          <div class="modal-actions modal-actions-row">
            <button class="btn btn-primary" type="button" data-confirm-yes>${I18n.t("common.confirm")}</button>
            <button class="btn btn-ghost" type="button" data-confirm-no>${I18n.t("common.cancel")}</button>
          </div>
        `);
        const onClick = (event) => {
          const yes = event.target.closest("[data-confirm-yes]");
          const no = event.target.closest("[data-confirm-no]");
          if (!yes && !no) return;
          content().removeEventListener("click", onClick);
          this.close();
          resolve(Boolean(yes));
        };
        content().addEventListener("click", onClick);
      });
    },

    chooseDifficulty(current) {
      const options = UNO_CONSTANTS.DIFFICULTIES.map((difficulty) => ({
        value: difficulty,
        label: `${difficulty === "easy" ? "😊" : difficulty === "normal" ? "🧐" : "😈"} ${I18n.t(`difficulty.${difficulty}`)}${difficulty === current ? " ✓" : ""}`,
        className: difficulty === current ? "btn-primary" : "",
      }));
      return this.promptChoice(I18n.t("menu.chooseDifficulty"), options);
    },

    chooseColor() {
      const options = UNO_CONSTANTS.COLORS.map((color) => ({
        value: color,
        color,
        label: I18n.t(`game.${color}`),
        className: "color-choice",
      }));
      return this.promptChoice(I18n.t("game.chooseColor"), options);
    },
  };

  window.Modal = Modal;
})();
