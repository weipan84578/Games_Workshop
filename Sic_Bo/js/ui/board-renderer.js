(function () {
  window.SicBo = window.SicBo || {};

  const pipMap = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  function makeDie(value, rolling) {
    const die = document.createElement("div");
    die.className = "die" + (rolling ? " is-rolling" : "");
    die.setAttribute("aria-label", String(value));
    pipMap[value].forEach(function (position) {
      const pip = document.createElement("span");
      pip.className = "pip pip-pos-" + position + ((value === 1 || value === 4) ? " pip-red" : "");
      die.appendChild(pip);
    });
    return die;
  }

  function createRenderer(callbacks) {
    const elements = {
      actionBar: document.getElementById("actionBar"),
      balance: document.getElementById("balanceValue"),
      betBoard: document.getElementById("betBoard"),
      betTotal: document.getElementById("betTotalValue"),
      chipTray: document.getElementById("chipTray"),
      confirm: document.getElementById("confirmBetButton"),
      clear: document.getElementById("clearBetButton"),
      diceArena: document.getElementById("diceArena"),
      diceCup: document.getElementById("diceCup"),
      diceRow: document.getElementById("diceRow"),
      history: document.getElementById("historyList"),
      historyPanel: document.querySelector(".history-panel"),
      langTheme: document.getElementById("langThemeValue"),
      repeat: document.getElementById("repeatBetButton"),
      roll: document.getElementById("rollButton"),
      round: document.getElementById("roundValue"),
      result: document.getElementById("roundResult"),
      toggleHistory: document.getElementById("toggleHistoryButton"),
      undo: document.getElementById("undoBetButton")
    };

    function renderBetBoard(game) {
      const currentBets = game.betting.state.currentBets;
      const winners = game.result ? game.result.winningBetIds : [];
      if (!elements.betBoard.dataset.ready) {
        elements.betBoard.textContent = "";
        window.SicBo.BetTypes.all.forEach(function (bet) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "bet-cell";
          button.dataset.betId = bet.id;
          if (bet.size) button.dataset.size = bet.size;
          button.addEventListener("click", function () {
            callbacks.onBetClick(bet.id);
          });
          elements.betBoard.appendChild(button);
        });
        elements.betBoard.dataset.ready = "true";
      }

      elements.betBoard.querySelectorAll(".bet-cell").forEach(function (button) {
        const bet = window.SicBo.BetTypes.byId[button.dataset.betId];
        const amount = currentBets[bet.id] || 0;
        button.disabled = game.phase === "rolling" || game.betting.state.locked || game.betting.state.balance < game.betting.state.selectedChip;
        button.classList.toggle("has-bet", amount > 0);
        button.classList.toggle("is-winning", winners.indexOf(bet.id) !== -1);
        button.innerHTML = "";

        const name = document.createElement("strong");
        name.className = "bet-name";
        name.textContent = window.SicBo.I18n.betName(bet);

        const odds = document.createElement("span");
        odds.className = "bet-odds";
        odds.textContent = window.SicBo.I18n.oddsLabel(bet);

        const desc = document.createElement("span");
        desc.className = "bet-description";
        desc.textContent = window.SicBo.I18n.betDescription(bet);

        button.append(name, odds, desc);
        if (amount > 0) {
          const badge = document.createElement("span");
          badge.className = "bet-amount";
          badge.textContent = window.SicBo.Format.money(amount);
          badge.setAttribute("aria-label", window.SicBo.I18n.t("game.betTotalLabel", { amount: window.SicBo.Format.money(amount) }));
          button.appendChild(badge);
        }
      });
    }

    function renderChips(game) {
      if (!elements.chipTray.dataset.ready) {
        elements.chipTray.textContent = "";
        window.SicBo.BetTypes.CHIP_VALUES.forEach(function (value) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "chip-button chip-" + value;
          button.dataset.chip = String(value);
          button.setAttribute("role", "radio");
          button.innerHTML = '<span class="chip-value">' + value + "</span>";
          button.addEventListener("click", function () {
            callbacks.onChipSelect(value);
          });
          elements.chipTray.appendChild(button);
        });
        elements.chipTray.dataset.ready = "true";
      }
      elements.chipTray.querySelectorAll(".chip-button").forEach(function (button) {
        const active = Number(button.dataset.chip) === game.betting.state.selectedChip;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-checked", active ? "true" : "false");
      });
    }

    function renderDice(game) {
      elements.diceRow.textContent = "";
      const rolling = game.phase === "rolling";
      const dice = game.result ? game.result.dice : [1, 2, 3];
      dice.forEach(function (value) {
        elements.diceRow.appendChild(makeDie(value, rolling));
      });
      elements.diceCup.classList.toggle("is-rolling", rolling);
      elements.actionBar.classList.toggle("is-rolling", rolling);

      if (rolling) {
        elements.result.textContent = window.SicBo.I18n.t("game.rolling");
      } else if (game.result) {
        const diceText = game.result.dice.join("-");
        const line = window.SicBo.I18n.t("game.resultLine", { dice: diceText, total: game.result.stats.total });
        const winLose = game.result.returnAmount > 0
          ? window.SicBo.I18n.t("game.winLine", { amount: window.SicBo.Format.money(game.result.returnAmount) })
          : window.SicBo.I18n.t("game.loseLine");
        elements.result.textContent = line + " " + winLose;
      } else {
        elements.result.textContent = window.SicBo.I18n.t("game.waitingResult");
      }
    }

    function renderHistory(game) {
      elements.history.textContent = "";
      if (game.history.length === 0) {
        const empty = document.createElement("li");
        empty.className = "history-item";
        empty.textContent = window.SicBo.I18n.t("game.emptyHistory");
        elements.history.appendChild(empty);
        return;
      }
      game.history.forEach(function (round, index) {
        const item = document.createElement("li");
        item.className = "history-item";
        const dice = document.createElement("span");
        dice.className = "history-dice";
        round.dice.forEach(function (value) {
          const die = document.createElement("span");
          die.className = "history-die";
          die.textContent = value;
          dice.appendChild(die);
        });
        const total = document.createElement("strong");
        total.className = "history-total";
        total.textContent = "#" + (game.round - index - 1) + " / " + round.total;
        item.append(dice, total);
        elements.history.appendChild(item);
      });
    }

    function renderControls(game) {
      const total = game.betting.getBetTotal();
      const rolling = game.phase === "rolling";
      const locked = game.betting.state.locked;
      elements.balance.textContent = window.SicBo.Format.money(game.betting.state.balance);
      elements.betTotal.textContent = window.SicBo.Format.money(total);
      elements.round.textContent = window.SicBo.Format.money(game.round);
      elements.langTheme.textContent = window.SicBo.I18n.languageThemeLabel(document.documentElement.dataset.theme);
      elements.confirm.disabled = rolling || locked || total <= 0;
      elements.roll.disabled = rolling || total <= 0;
      elements.clear.disabled = rolling || locked || total <= 0;
      elements.undo.disabled = rolling || locked || game.betting.state.betStack.length <= 0;
      elements.repeat.disabled = rolling || locked || game.betting.state.lastBets.length <= 0;
    }

    elements.toggleHistory.addEventListener("click", function () {
      elements.historyPanel.classList.toggle("is-open");
    });

    return {
      render: function (apiOrGame) {
        const game = apiOrGame.engine ? apiOrGame.engine : apiOrGame;
        renderControls(game);
        renderChips(game);
        renderDice(game);
        renderBetBoard(game);
        renderHistory(game);
      },
      renderRawEngine: function (game) {
        renderControls(game);
        renderChips(game);
        renderDice(game);
        renderBetBoard(game);
        renderHistory(game);
      }
    };
  }

  window.SicBo.BoardRenderer = {
    create: createRenderer,
    makeDie: makeDie
  };
})();
