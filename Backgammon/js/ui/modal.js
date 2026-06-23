(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function button(label, className, handler) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = className || "btn btn-secondary";
    element.textContent = label;
    element.addEventListener("click", handler);
    return element;
  }

  BG.Modal = {
    root: null,
    title: null,
    body: null,
    actions: null,

    init() {
      this.root = document.getElementById("modalRoot");
      this.title = document.getElementById("modalTitle");
      this.body = document.getElementById("modalBody");
      this.actions = document.getElementById("modalActions");
      this.root.querySelectorAll("[data-modal-close]").forEach((control) => {
        control.addEventListener("click", () => this.close());
      });
    },

    show(title, bodyContent, actionElements) {
      this.title.textContent = title;
      this.body.replaceChildren();
      this.actions.replaceChildren();
      if (typeof bodyContent === "string") {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = bodyContent;
        this.body.append(wrapper);
      } else if (bodyContent) {
        this.body.append(bodyContent);
      }
      (actionElements || []).forEach((action) => this.actions.append(action));
      this.root.classList.add("active");
      this.root.setAttribute("aria-hidden", "false");
    },

    close() {
      this.root.classList.remove("active");
      this.root.setAttribute("aria-hidden", "true");
    },

    chooseDifficulty(onChoose) {
      const list = document.createElement("div");
      list.className = "difficulty-list";
      const locale = BG.I18n.currentLocale;
      const desc = {
        easy: {
          "zh-TW": "AI 隨機選擇，適合初學",
          en: "Random moves for learning the board",
          ja: "ランダムに動く入門向け",
        },
        normal: {
          "zh-TW": "AI 採貪婪策略，攻守均衡",
          en: "Greedy tactics with balanced pressure",
          ja: "攻守のバランスを取る通常 AI",
        },
        hard: {
          "zh-TW": "AI 會預估下一手風險",
          en: "Looks ahead for reply risk",
          ja: "次の反撃リスクを読む強めの AI",
        },
      };
      [
        ["easy", BG.I18n.t("settings.easy")],
        ["normal", BG.I18n.t("settings.normal")],
        ["hard", BG.I18n.t("settings.hard")],
      ].forEach(([value, title]) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "difficulty-card";
        item.innerHTML = `<strong>${title}</strong><span>${desc[value][locale] || desc[value]["zh-TW"]}</span>`;
        item.addEventListener("click", () => {
          this.close();
          onChoose(value);
        });
        list.append(item);
      });
      this.show(BG.I18n.t("settings.difficulty"), list, [
        button(BG.I18n.t("common.cancel"), "btn btn-ghost", () => this.close()),
      ]);
    },

    showResult(game, onAgain, onMenu) {
      const winnerKey = game.winner === "player" ? "result.win" : "result.lose";
      const typeKey = game.winType === "backgammon" ? "result.backgammon" : game.winType === "gammon" ? "result.gammon" : "result.normal";
      const body = document.createElement("div");
      body.className = "result-body";
      body.innerHTML = `<p><strong>${BG.I18n.t(winnerKey)}</strong></p><p>${BG.I18n.t(typeKey)}</p>`;
      this.show(BG.I18n.t(winnerKey), body, [
        button(BG.I18n.t("result.play_again"), "btn btn-primary", () => {
          this.close();
          onAgain();
        }),
        button(BG.I18n.t("result.back_to_menu"), "btn btn-secondary", () => {
          this.close();
          onMenu();
        }),
      ]);
    },
  };
})(window);
