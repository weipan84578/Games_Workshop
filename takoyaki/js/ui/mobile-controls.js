(function registerMobileControls(app) {
  "use strict";

  let root = null;
  let collapsed = false;

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  function render() {
    if (!root) {
      return;
    }
    const selectedTool = app.State.get().selectedTool;
    root.innerHTML = `
      <div class="mobile-controls ${collapsed ? "is-collapsed" : ""}">
        <div class="mobile-controls-head">
          <strong>${t("mobile_tools")}</strong>
          <button class="btn btn-quiet icon-btn" type="button" data-mobile-toggle aria-label="${collapsed ? t("mobile_expand") : t("mobile_collapse")}">
            <span class="icon" aria-hidden="true">${collapsed ? "↑" : "↓"}</span>
          </button>
        </div>
        <div class="mobile-tool-list">
          ${app.Config.tools.map((tool) => `
            <button class="btn btn-secondary" type="button" data-mobile-tool="${tool.id}" aria-pressed="${selectedTool === tool.id}" title="${t(tool.key)}">
              <span class="icon" aria-hidden="true">${tool.icon}</span>
              <span>${t(tool.key)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
    root.querySelector("[data-mobile-toggle]").addEventListener("click", () => {
      collapsed = !collapsed;
      app.AudioManager.playSfx("button");
      render();
    });
    root.querySelectorAll("[data-mobile-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        app.State.setSelectedTool(button.dataset.mobileTool);
        app.AudioManager.playSfx("button");
        app.MobileControls.sync();
      });
    });
  }

  app.MobileControls = {
    mount(container) {
      root = container;
      render();
    },

    sync() {
      if (!root) {
        return;
      }
      const selectedTool = app.State.get().selectedTool;
      root.querySelectorAll("[data-mobile-tool]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.mobileTool === selectedTool));
      });
    },

    rerender: render
  };

  app.EventBus.on("i18n:changed", render);
})(window.Takoyaki = window.Takoyaki || {});
