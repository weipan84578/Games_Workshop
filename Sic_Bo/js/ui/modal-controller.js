(function () {
  window.SicBo = window.SicBo || {};

  function createModalController() {
    const helpDialog = document.getElementById("helpDialog");
    const helpBody = document.getElementById("helpBody");
    const settingsDialog = document.getElementById("settingsDialog");
    const resultDialog = document.getElementById("resultDialog");
    const resultSummary = document.getElementById("resultSummary");
    const resultMenuButton = document.getElementById("resultMenuButton");
    const toastRegion = document.getElementById("toastRegion");
    let resultMenuHandler = null;

    function showDialog(dialog) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "open");
      }
    }

    function toast(message, type) {
      const node = document.createElement("div");
      node.className = "toast " + (type || "");
      node.textContent = message;
      toastRegion.appendChild(node);
      window.setTimeout(function () {
        node.remove();
      }, 3200);
    }

    function makeTabButton(key, panelId, active) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button compact-button" + (active ? " is-active" : "");
      button.textContent = window.SicBo.I18n.t(key);
      button.setAttribute("aria-controls", panelId);
      return button;
    }

    function renderOddsTable() {
      const wrap = document.createElement("div");
      wrap.style.overflowX = "auto";
      const table = document.createElement("table");
      table.className = "odds-table";
      table.innerHTML = "<thead><tr><th></th><th></th><th></th></tr></thead><tbody></tbody>";
      const headers = table.querySelectorAll("th");
      headers[0].textContent = window.SicBo.I18n.t("help.betHeader");
      headers[1].textContent = window.SicBo.I18n.t("help.oddsHeader");
      headers[2].textContent = window.SicBo.I18n.t("help.ruleHeader");
      const tbody = table.querySelector("tbody");
      window.SicBo.BetTypes.all.forEach(function (bet) {
        const tr = document.createElement("tr");
        const name = document.createElement("td");
        const odds = document.createElement("td");
        const desc = document.createElement("td");
        name.textContent = window.SicBo.I18n.betName(bet);
        odds.textContent = window.SicBo.I18n.oddsLabel(bet);
        desc.textContent = window.SicBo.I18n.betDescription(bet);
        tr.append(name, odds, desc);
        tbody.appendChild(tr);
      });
      wrap.appendChild(table);
      return wrap;
    }

    function renderHelp() {
      helpBody.textContent = "";
      const tabs = document.createElement("div");
      tabs.className = "help-tabs";
      const panels = document.createElement("div");
      panels.className = "help-panels";
      const panelDefs = [
        { id: "helpIntro", key: "help.introTab" },
        { id: "helpBets", key: "help.betsTab" },
        { id: "helpRules", key: "help.rulesTab" },
        { id: "helpFaq", key: "help.faqTab" }
      ];

      function activate(id) {
        tabs.querySelectorAll("button").forEach(function (button) {
          button.classList.toggle("is-active", button.getAttribute("aria-controls") === id);
        });
        panels.querySelectorAll(".help-panel").forEach(function (panel) {
          panel.hidden = panel.id !== id;
        });
      }

      panelDefs.forEach(function (def, index) {
        const tab = makeTabButton(def.key, def.id, index === 0);
        tab.addEventListener("click", function () { activate(def.id); });
        tabs.appendChild(tab);
      });

      const intro = document.createElement("section");
      intro.id = "helpIntro";
      intro.className = "help-panel";
      intro.innerHTML = '<h3></h3><p></p><h3></h3><div class="steps-grid"></div><h3></h3><div class="help-card map-card"><img src="docs-assets/bet-area-map.svg" alt="" loading="lazy"><p></p></div>';
      intro.querySelectorAll("h3")[0].textContent = window.SicBo.I18n.t("help.introTitle");
      intro.querySelector("p").textContent = window.SicBo.I18n.t("help.introText");
      intro.querySelectorAll("h3")[1].textContent = window.SicBo.I18n.t("help.stepsTitle");
      ["help.step1", "help.step2", "help.step3", "help.step4"].forEach(function (key, index) {
        const card = document.createElement("div");
        card.className = "help-card";
        card.innerHTML = "<strong></strong><p></p>";
        card.querySelector("strong").textContent = window.SicBo.I18n.t("help.stepLabel") + " " + (index + 1);
        card.querySelector("p").textContent = window.SicBo.I18n.t(key);
        intro.querySelector(".steps-grid").appendChild(card);
      });
      intro.querySelectorAll("h3")[2].textContent = window.SicBo.I18n.t("help.mapTitle");
      intro.querySelector(".map-card p").textContent = window.SicBo.I18n.t("help.mapText");

      const bets = document.createElement("section");
      bets.id = "helpBets";
      bets.className = "help-panel";
      bets.hidden = true;
      const oddsTitle = document.createElement("h3");
      oddsTitle.textContent = window.SicBo.I18n.t("help.oddsTitle");
      bets.append(oddsTitle, renderOddsTable());

      const rules = document.createElement("section");
      rules.id = "helpRules";
      rules.className = "help-panel";
      rules.hidden = true;
      rules.innerHTML = '<div class="help-card"><h3></h3><div class="dice-row"></div><p></p></div>';
      rules.querySelector("h3").textContent = window.SicBo.I18n.t("help.specialTitle");
      rules.querySelector("p").textContent = window.SicBo.I18n.t("help.specialText");
      [6, 6, 6].forEach(function (value) {
        rules.querySelector(".dice-row").appendChild(window.SicBo.BoardRenderer.makeDie(value, false));
      });

      const faq = document.createElement("section");
      faq.id = "helpFaq";
      faq.className = "help-panel";
      faq.hidden = true;
      const faqTitle = document.createElement("h3");
      faqTitle.textContent = window.SicBo.I18n.t("help.faqTitle");
      faq.appendChild(faqTitle);
      [[1], [2], [3]].forEach(function (_, index) {
        const item = document.createElement("details");
        item.className = "faq-item";
        const n = index + 1;
        item.innerHTML = "<summary></summary><p></p>";
        item.querySelector("summary").textContent = window.SicBo.I18n.t("help.faq" + n + "Q");
        item.querySelector("p").textContent = window.SicBo.I18n.t("help.faq" + n + "A");
        faq.appendChild(item);
      });

      panels.append(intro, bets, rules, faq);
      helpBody.append(tabs, panels);
    }

    resultMenuButton.addEventListener("click", function () {
      resultDialog.close();
      if (resultMenuHandler) resultMenuHandler();
    });

    return {
      openHelp: function () {
        renderHelp();
        showDialog(helpDialog);
      },
      openSettings: function () {
        showDialog(settingsDialog);
      },
      setResultMenuHandler: function (handler) {
        resultMenuHandler = handler;
      },
      showResult: function (apiOrGame, settlement) {
        const game = apiOrGame.engine ? apiOrGame.engine : apiOrGame;
        resultSummary.textContent = "";
        const dice = document.createElement("div");
        dice.className = "dice-row";
        settlement.dice.forEach(function (value) {
          dice.appendChild(window.SicBo.BoardRenderer.makeDie(value, false));
        });
        const payout = document.createElement("p");
        payout.innerHTML = "<strong>" + window.SicBo.I18n.t("result.payout") + ":</strong> " + window.SicBo.Format.money(settlement.returnAmount);
        const balance = document.createElement("p");
        balance.innerHTML = "<strong>" + window.SicBo.I18n.t("result.balance") + ":</strong> " + window.SicBo.Format.money(game.betting.state.balance);
        const hits = document.createElement("p");
        const names = settlement.details.filter(function (item) { return item.won; }).map(function (item) {
          return window.SicBo.I18n.betName(item.bet);
        });
        hits.innerHTML = "<strong>" + window.SicBo.I18n.t("result.hits") + ":</strong> " + (names.length ? names.join(", ") : window.SicBo.I18n.t("game.loseLine"));
        resultSummary.append(dice, payout, balance, hits);
        if (settlement.returnAmount > 0) {
          window.SicBo.AnimationController.burstParticles(document.getElementById("diceArena"), 28);
        }
        showDialog(resultDialog);
      },
      toast: toast
    };
  }

  window.SicBo.ModalController = {
    create: createModalController
  };
})();
