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
    const toastStack = {
      count: 0,
      countNode: null,
      messageNode: null,
      node: null,
      timer: null
    };
    let resultMenuHandler = null;

    function showDialog(dialog) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "open");
      }
    }

    function toast(message, type) {
      if (toastStack.node) {
        toastStack.count += 1;
        toastStack.messageNode.textContent = message;
        toastStack.node.className = "toast " + (type || "");
        toastStack.node.classList.add("is-stacked");
        toastStack.node.dataset.stackCount = String(Math.min(toastStack.count, 3));
        toastStack.countNode.hidden = false;
        toastStack.countNode.textContent = "x" + toastStack.count;
        window.clearTimeout(toastStack.timer);
        toastStack.timer = window.setTimeout(function () {
          toastStack.node.remove();
          toastStack.count = 0;
          toastStack.countNode = null;
          toastStack.messageNode = null;
          toastStack.node = null;
          toastStack.timer = null;
        }, 3200);
        return;
      }

      const node = document.createElement("div");
      node.className = "toast " + (type || "");
      node.dataset.stackCount = "1";

      const messageNode = document.createElement("span");
      messageNode.className = "toast-message";
      messageNode.textContent = message;

      const countNode = document.createElement("span");
      countNode.className = "toast-count";
      countNode.hidden = true;

      node.append(messageNode, countNode);
      toastRegion.appendChild(node);

      toastStack.count = 1;
      toastStack.countNode = countNode;
      toastStack.messageNode = messageNode;
      toastStack.node = node;
      toastStack.timer = window.setTimeout(function () {
        node.remove();
        toastStack.count = 0;
        toastStack.countNode = null;
        toastStack.messageNode = null;
        toastStack.node = null;
        toastStack.timer = null;
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

    function makeMiniDie(value) {
      const die = document.createElement("span");
      die.className = "mini-die";
      die.textContent = value;
      return die;
    }

    function renderOddsVisual(bet) {
      const visual = document.createElement("span");
      visual.className = "odds-visual";
      if (bet.kind === "total") {
        visual.textContent = String(bet.value);
        return visual;
      }
      if (bet.kind === "single") {
        visual.appendChild(makeMiniDie(bet.value));
        return visual;
      }
      if (bet.kind === "double") {
        visual.append(makeMiniDie(bet.value), makeMiniDie(bet.value));
        return visual;
      }
      if (bet.kind === "triple") {
        visual.append(makeMiniDie(bet.value), makeMiniDie(bet.value), makeMiniDie(bet.value));
        return visual;
      }
      if (bet.kind === "anyTriple") {
        visual.append(makeMiniDie(3), makeMiniDie(3), makeMiniDie(3));
        return visual;
      }
      if (bet.kind === "combo") {
        visual.append(makeMiniDie(bet.values[0]), makeMiniDie(bet.values[1]));
        return visual;
      }
      if (bet.id === "big") visual.textContent = "11-17";
      if (bet.id === "small") visual.textContent = "4-10";
      if (bet.id === "odd") visual.textContent = "1/3/5";
      if (bet.id === "even") visual.textContent = "2/4/6";
      return visual;
    }

    function renderOddsTable() {
      const categoryDefs = [
        { id: "basic", key: "help.categoryBasic", groups: ["basic"] },
        { id: "total", key: "help.categoryTotal", groups: ["total"] },
        { id: "single", key: "help.categorySingle", groups: ["single"] },
        { id: "triple", key: "help.categoryTriple", groups: ["double", "triple"] },
        { id: "combo", key: "help.categoryCombo", groups: ["combo"] }
      ];
      const wrap = document.createElement("div");
      wrap.className = "odds-wrap";
      const categoryTabs = document.createElement("div");
      categoryTabs.className = "odds-category-tabs";
      categoryDefs.forEach(function (category) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ghost-button compact-button";
        button.dataset.oddsCategory = category.id;
        button.textContent = window.SicBo.I18n.t(category.key);
        button.addEventListener("click", function () {
          categoryTabs.querySelectorAll("button").forEach(function (tab) {
            tab.classList.toggle("is-active", tab === button);
          });
          table.querySelectorAll("tbody tr").forEach(function (row) {
            const visible = category.groups.indexOf(row.dataset.group) !== -1;
            row.hidden = !visible;
          });
        });
        categoryTabs.appendChild(button);
      });

      const tableScroller = document.createElement("div");
      tableScroller.className = "odds-table-scroll";
      const table = document.createElement("table");
      table.className = "odds-table";
      table.innerHTML = "<thead><tr><th></th><th></th><th></th><th></th></tr></thead><tbody></tbody>";
      const headers = table.querySelectorAll("th");
      headers[0].textContent = window.SicBo.I18n.t("help.visualHeader");
      headers[1].textContent = window.SicBo.I18n.t("help.betHeader");
      headers[2].textContent = window.SicBo.I18n.t("help.oddsHeader");
      headers[3].textContent = window.SicBo.I18n.t("help.ruleHeader");
      const tbody = table.querySelector("tbody");
      window.SicBo.BetTypes.all.forEach(function (bet) {
        const tr = document.createElement("tr");
        tr.dataset.group = bet.group;
        const visual = document.createElement("td");
        const name = document.createElement("td");
        const odds = document.createElement("td");
        const desc = document.createElement("td");
        visual.appendChild(renderOddsVisual(bet));
        name.textContent = window.SicBo.I18n.betName(bet);
        odds.textContent = window.SicBo.I18n.oddsLabel(bet);
        desc.textContent = window.SicBo.I18n.betDescription(bet);
        tr.append(visual, name, odds, desc);
        tbody.appendChild(tr);
      });
      tableScroller.appendChild(table);
      wrap.append(categoryTabs, tableScroller);
      return wrap;
    }

    function renderBetMap(root) {
      const sections = [
        { className: "map-basic", title: "help.categoryBasic", body: "11-17 / 4-10 / 1-3-5 / 2-4-6" },
        { className: "map-total", title: "help.categoryTotal", body: "4 5 6 7 8 9 10 11 12 13 14 15 16 17" },
        { className: "map-single", title: "help.categorySingle", body: "1 2 3 4 5 6" },
        { className: "map-triple", title: "help.categoryTriple", body: "11 22 33 44 55 66 / 111 222 333 444 555 666" },
        { className: "map-combo", title: "help.categoryCombo", body: "1+2 1+3 1+4 ... 4+6 5+6" }
      ];

      root.textContent = "";
      sections.forEach(function (section) {
        const item = document.createElement("div");
        item.className = "bet-map-section " + section.className;
        const title = document.createElement("strong");
        const body = document.createElement("span");
        title.textContent = window.SicBo.I18n.t(section.title);
        body.textContent = section.body;
        item.append(title, body);
        root.appendChild(item);
      });
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
      intro.innerHTML = '<h3></h3><p></p><div class="help-card menu-die-help"><h3></h3><p></p></div><h3></h3><div class="steps-grid"></div><h3></h3><div class="help-card map-card"><div class="bet-map" aria-hidden="true"></div><p></p></div>';
      intro.querySelectorAll("h3")[0].textContent = window.SicBo.I18n.t("help.introTitle");
      intro.querySelector("p").textContent = window.SicBo.I18n.t("help.introText");
      intro.querySelector(".menu-die-help h3").textContent = window.SicBo.I18n.t("help.menuDieTitle");
      intro.querySelector(".menu-die-help p").textContent = window.SicBo.I18n.t("help.menuDieText");
      intro.querySelectorAll("h3")[2].textContent = window.SicBo.I18n.t("help.stepsTitle");
      ["help.step1", "help.step2", "help.step3", "help.step4"].forEach(function (key, index) {
        const card = document.createElement("div");
        card.className = "help-card";
        card.innerHTML = "<strong></strong><p></p>";
        card.querySelector("strong").textContent = window.SicBo.I18n.t("help.stepLabel") + " " + (index + 1);
        card.querySelector("p").textContent = window.SicBo.I18n.t(key);
        intro.querySelector(".steps-grid").appendChild(card);
      });
      intro.querySelectorAll("h3")[3].textContent = window.SicBo.I18n.t("help.mapTitle");
      renderBetMap(intro.querySelector(".bet-map"));
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
