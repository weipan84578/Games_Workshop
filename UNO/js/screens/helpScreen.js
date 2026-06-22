(function () {
  function sampleCards() {
    const cards = [
      { type: "number", color: "red", value: 5, id: "help_r5" },
      { type: "number", color: "blue", value: 3, id: "help_b3" },
      { type: "action", color: "green", value: "skip", id: "help_gs" },
      { type: "action", color: "yellow", value: "draw_two", id: "help_y2" },
      { type: "wild", color: null, value: "wild", id: "help_w" },
      { type: "wild", color: null, value: "wild_draw_four", id: "help_w4" },
    ];
    return cards.map((card) => CardRenderer.renderCard(card, { className: "card-help" })).join("");
  }

  const HelpScreen = {
    render(container) {
      const root = container || Helpers.qs("#screen-help");
      root.className = "screen content-screen";
      root.innerHTML = `
        <header class="screen-header">
          <button class="btn btn-icon" type="button" data-action="back" aria-label="${I18n.t("common.back")}">←</button>
          <h1>${I18n.t("help.title")}</h1>
          <span></span>
        </header>
        <div class="content-wrap">
          <section class="help-toc">
            <div class="toc-icon">📖</div>
            <div>
              <h2>${I18n.t("help.toc")}</h2>
              <div class="toc-links">
                <button class="btn btn-tag" data-scroll="basics">${I18n.t("help.basics")}</button>
                <button class="btn btn-tag" data-scroll="cards">${I18n.t("help.cardTypes")}</button>
                <button class="btn btn-tag" data-scroll="special">${I18n.t("help.specialCards")}</button>
                <button class="btn btn-tag" data-scroll="victory">${I18n.t("help.victory")}</button>
                <button class="btn btn-tag" data-scroll="uno">${I18n.t("help.unoRule")}</button>
              </div>
            </div>
          </section>
          <section class="help-section" id="basics">
            <h2>🎯 ${I18n.t("help.basics")}</h2>
            <p>${I18n.t("help.basicsText")}</p>
          </section>
          <section class="help-section" id="cards">
            <h2>🃏 ${I18n.t("help.cardTypes")}</h2>
            <div class="card-samples">${sampleCards()}</div>
            <p>${I18n.t("help.cardTypesText")}</p>
          </section>
          <section class="help-section" id="special">
            <h2>✨ ${I18n.t("help.specialCards")}</h2>
            <p>${I18n.t("help.specialText")}</p>
          </section>
          <section class="help-section" id="victory">
            <h2>🏆 ${I18n.t("help.victory")}</h2>
            <p>${I18n.t("help.victoryText")}</p>
          </section>
          <section class="help-section" id="uno">
            <h2>🗣 ${I18n.t("help.unoRule")}</h2>
            <p>${I18n.t("help.unoText")}</p>
          </section>
        </div>
      `;

      root.onclick = (event) => {
        if (event.target.closest('[data-action="back"]')) {
          SFX.play("button");
          App.showScreen("main-menu");
          return;
        }
        const id = event.target.closest("[data-scroll]")?.dataset.scroll;
        if (id) {
          SFX.play("button");
          Helpers.qs(`#${id}`, root)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    },
  };

  window.HelpScreen = HelpScreen;
})();
