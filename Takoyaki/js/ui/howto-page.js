(function registerHowToPage(app) {
  "use strict";

  let currentStep = 0;
  let touchStartX = 0;

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  function clampStep(value) {
    return Math.max(0, Math.min(app.Config.howtoSteps.length - 1, value));
  }

  function draw(root) {
    const step = app.Config.howtoSteps[currentStep];
    root.innerHTML = `
      <div class="page-frame">
        <header class="page-header">
          <button class="btn btn-quiet icon-btn" type="button" data-howto="back" aria-label="${t("action_back")}">
            <span class="icon" aria-hidden="true">←</span>
          </button>
          <div>
            <h2>${t("howto_title")}</h2>
            <p class="muted">${t("howto_subtitle")}</p>
          </div>
        </header>
        <section class="panel howto-stage">
          <article class="howto-card" data-step-card>
            <div class="howto-visual" aria-hidden="true">${step.icon}</div>
            <div class="howto-text">
              <h3>${t(step.title)}</h3>
              <p>${t(step.body)}</p>
            </div>
          </article>
          <div class="howto-nav">
            <button class="btn btn-secondary icon-btn" type="button" data-howto="prev" aria-label="${t("action_prev")}" ${currentStep === 0 ? "disabled" : ""}>
              <span class="icon" aria-hidden="true">←</span>
            </button>
            <div class="step-dots" aria-label="${currentStep + 1}/${app.Config.howtoSteps.length}">
              ${app.Config.howtoSteps.map((_, index) => `<span class="step-dot ${index === currentStep ? "is-active" : ""}"></span>`).join("")}
            </div>
            <button class="btn btn-secondary icon-btn" type="button" data-howto="next" aria-label="${t("action_next")}" ${currentStep === app.Config.howtoSteps.length - 1 ? "disabled" : ""}>
              <span class="icon" aria-hidden="true">→</span>
            </button>
          </div>
          <button class="btn btn-quiet" type="button" data-howto="back-bottom"><span class="icon" aria-hidden="true">←</span><span>${t("action_back")}</span></button>
        </section>
      </div>
    `;
    root.querySelectorAll("[data-howto='back'], [data-howto='back-bottom']").forEach((button) => {
      button.addEventListener("click", () => {
        app.AudioManager.playSfx("button");
        app.ScreenManager.show("main-menu");
        app.MainMenu.render();
      });
    });
    root.querySelector("[data-howto='prev']").addEventListener("click", () => {
      app.AudioManager.playSfx("button");
      currentStep = clampStep(currentStep - 1);
      draw(root);
    });
    root.querySelector("[data-howto='next']").addEventListener("click", () => {
      app.AudioManager.playSfx("button");
      currentStep = clampStep(currentStep + 1);
      draw(root);
    });
    const card = root.querySelector("[data-step-card]");
    card.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    card.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 36) {
        return;
      }
      currentStep = clampStep(currentStep + (distance < 0 ? 1 : -1));
      draw(root);
    }, { passive: true });
  }

  app.HowToPage = {
    render() {
      draw(document.getElementById("screen-howto"));
    }
  };

  app.EventBus.on("i18n:changed", () => {
    if (app.State.get().screen === "howto") {
      app.HowToPage.render();
    }
  });
})(window.Takoyaki = window.Takoyaki || {});
