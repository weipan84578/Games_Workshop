window.YZ = window.YZ || {};

YZ.GameUI = (function () {
  var resultDialogOpen = false;
  var lastResultId = null;

  function t(key, args) {
    return YZ.I18n.t(key, args);
  }

  function render() {
    var root = document.getElementById("screen-game");
    if (!root) return;
    var state = YZ.State.get();
    var playerTotals = YZ.Scoring.totals(state.score.player);
    var aiTotals = YZ.Scoring.totals(state.score.ai);
    var canRoll = state.turn === "player" && state.rollsLeft > 0;
    var canScore = state.turn === "player" && YZ.Scoring.hasRolled(state.dice);
    var best = YZ.Settings.get("showHints") ? YZ.Game.bestHint() : null;

    root.innerHTML = [
      '<div class="game-shell">',
      '<header class="game-topbar">',
      '<button class="btn btn--ghost" id="game-pause">⏸ ' + YZ.Effects.esc(t("game.pause")) + "</button>",
      '<div class="game-stats">',
      stat(t("common.player"), playerTotals.grandTotal),
      stat(t("common.ai"), aiTotals.grandTotal),
      stat(t("common.round"), state.round + "/" + YZ.Constants.TOTAL_ROUNDS),
      "</div>",
      "</header>",
      '<div class="game-content">',
      '<section class="dice-panel panel">',
      renderTurnBanner(state),
      renderDice(state),
      renderActionbar(state, canRoll, canScore, best),
      renderAiLog(state),
      "</section>",
      '<section class="score-panel panel">',
      renderScorecard(state, best),
      "</section>",
      "</div>",
      "</div>"
    ].join("");

    bind(root);
  }

  function stat(label, value) {
    return '<div class="stat-tile"><span class="stat-label">' + YZ.Effects.esc(label) + '</span><span class="stat-value number">' + YZ.Effects.esc(value) + "</span></div>";
  }

  function renderTurnBanner(state) {
    var title = state.turn === "ai" ? t("game.aiTurn") : state.turn === "result" ? t("common.total") : t("game.yourTurn");
    var message;
    if (state.turn === "ai") message = t("game.aiThinking");
    else if (!YZ.Scoring.hasRolled(state.dice)) message = t("game.rollFirst");
    else if (state.rollsLeft <= 0) message = t("game.mustScore");
    else message = t("game.chooseScore");
    return [
      '<div class="turn-banner">',
      '<div><div class="turn-title">' + YZ.Effects.esc(title) + '</div><div class="turn-message">' + YZ.Effects.esc(message) + "</div></div>",
      '<span class="app-badge">' + YZ.Effects.esc(t("difficulty." + state.difficulty)) + "</span>",
      "</div>"
    ].join("");
  }

  function renderDice(state) {
    return '<div class="dice-tray">' + state.dice.map(function (value, index) {
      var cls = state.held[index] ? "die--held" : "";
      var disabled = state.turn !== "player" || !YZ.Scoring.hasRolled(state.dice) ? "disabled" : "";
      return '<button class="die ' + cls + '" data-die-index="' + index + '" data-value="' + value + '" data-face="' + (YZ.Constants.DIE_FACES[value] || "?") + '" ' + disabled + ' aria-label="' + t("game.hold") + '"></button>';
    }).join("") + "</div>";
  }

  function renderActionbar(state, canRoll, canScore, best) {
    return [
      '<div class="game-actionbar">',
      '<div class="game-actionbar__row">',
      '<button class="btn btn--primary" id="game-roll" ' + (canRoll ? "" : "disabled") + '>🎲 ' + YZ.Effects.esc(t("game.roll")) + ' <span class="number">(' + YZ.Effects.esc(t("game.rollsLeft", { n: state.rollsLeft })) + ")</span></button>",
      '<button class="btn" id="game-clear" ' + (state.held.some(Boolean) && state.turn === "player" ? "" : "disabled") + '>✕ ' + YZ.Effects.esc(t("game.clearHold")) + "</button>",
      "</div>",
      '<div class="game-actionbar__row">',
      '<button class="btn btn--secondary" id="game-best" ' + (canScore && best ? "" : "disabled") + '>★ ' + YZ.Effects.esc(t("game.scoreBest")) + (best ? " · " + YZ.Effects.esc(t("score." + best.key)) : "") + "</button>",
      "</div>",
      "</div>"
    ].join("");
  }

  function renderAiLog(state) {
    var logs = state.aiLog && state.aiLog.length ? state.aiLog.slice(0, 4) : [t("game.noRollYet")];
    return '<div class="ai-log">' + logs.map(function (line) {
      return '<div>' + YZ.Effects.esc(line) + "</div>";
    }).join("") + "</div>";
  }

  function renderScorecard(state, best) {
    var rows = [];
    rows.push(sectionRow(t("section.upper")));
    YZ.Constants.UPPER_KEYS.forEach(function (key) { rows.push(scoreRow(state, key, best)); });
    rows.push(totalRow(t("score.upperSubtotal"), YZ.Scoring.totals(state.score.player).upperSubtotal, YZ.Scoring.totals(state.score.ai).upperSubtotal));
    rows.push(totalRow(t("score.upperBonus"), YZ.Scoring.totals(state.score.player).upperBonus, YZ.Scoring.totals(state.score.ai).upperBonus));
    rows.push(sectionRow(t("section.lower")));
    YZ.Constants.LOWER_KEYS.forEach(function (key) { rows.push(scoreRow(state, key, best)); });
    rows.push(totalRow(t("score.lowerSubtotal"), YZ.Scoring.totals(state.score.player).lowerSubtotal, YZ.Scoring.totals(state.score.ai).lowerSubtotal));
    rows.push(totalRow(t("score.yahtzeeBonus"), state.score.player.yahtzeeBonus || 0, state.score.ai.yahtzeeBonus || 0));
    rows.push(totalRow(t("score.grandTotal"), YZ.Scoring.totals(state.score.player).grandTotal, YZ.Scoring.totals(state.score.ai).grandTotal, true));
    return [
      '<div class="scorecard">',
      '<table class="scorecard__table">',
      "<thead><tr>",
      '<th>' + YZ.Effects.esc(t("game.categoryColumn")) + "</th>",
      '<th>' + YZ.Effects.esc(t("game.playerColumn")) + "</th>",
      '<th>' + YZ.Effects.esc(t("game.aiColumn")) + "</th>",
      "</tr></thead>",
      "<tbody>" + rows.join("") + "</tbody>",
      "</table>",
      "</div>"
    ].join("");
  }

  function sectionRow(label) {
    return '<tr class="scorecard__section"><th colspan="3">' + YZ.Effects.esc(label) + "</th></tr>";
  }

  function totalRow(label, player, ai, grand) {
    return '<tr class="' + (grand ? "score-total" : "") + '"><td><strong>' + YZ.Effects.esc(label) + '</strong></td><td class="number"><strong>' + player + '</strong></td><td class="number"><strong>' + ai + "</strong></td></tr>";
  }

  function scoreRow(state, key, best) {
    var playerValue = state.score.player[key];
    var aiValue = state.score.ai[key];
    var canPreview = state.turn === "player" && playerValue === null && YZ.Scoring.hasRolled(state.dice);
    var preview = canPreview ? YZ.Scoring.previewScore(key, state.dice, state.score.player) : null;
    var isBest = best && best.key === key && canPreview;
    return [
      '<tr class="scorecard__row ' + (playerValue !== null ? "is-used " : "") + (isBest ? "is-best" : "") + '">',
      '<td><div class="scorecard__label"><span class="scorecard__name">' + YZ.Effects.scoreIcon(key) + '<span>' + YZ.Effects.esc(t("score." + key)) + "</span>" + (isBest ? ' <span class="app-badge">' + YZ.Effects.esc(t("game.hintBest")) + "</span>" : "") + '</span><span class="scorecard__rule">' + YZ.Effects.esc(t("rule." + key)) + "</span></div></td>",
      '<td>' + playerScoreButton(key, playerValue, preview, canPreview) + "</td>",
      '<td><span class="score-button ' + (aiValue !== null ? "is-filled" : "") + '">' + (aiValue === null ? "–" : aiValue) + "</span></td>",
      "</tr>"
    ].join("");
  }

  function playerScoreButton(key, value, preview, enabled) {
    if (value !== null) {
      return '<span class="score-button is-filled ' + (value === 0 ? "is-zero" : "") + '">' + value + "</span>";
    }
    if (!enabled) return '<button class="score-button" disabled>–</button>';
    return '<button class="score-button ' + (preview.total === 0 ? "is-zero" : "") + '" data-score-key="' + key + '">' + preview.total + "</button>";
  }

  async function pause() {
    var choice = await YZ.Effects.choice(t("game.pauseTitle"), t("game.pauseBody"), [
      { label: t("common.resume"), value: "resume", className: "btn--primary" },
      { label: t("common.menu"), value: "menu" },
      { label: t("common.newGame"), value: "new", className: "btn--danger" }
    ]);
    if (choice === "menu") {
      YZ.Game.saveIfPlayable();
      YZ.Effects.toast(t("game.saved"));
      YZ.ScreenManager.show("menu");
    }
    if (choice === "new") {
      var ok = await YZ.Effects.confirm(t("menu.overwriteTitle"), t("menu.overwriteBody"));
      if (ok) {
        YZ.Game.newGame(YZ.Settings.get("difficulty"));
        YZ.ScreenManager.show("game");
      }
    }
  }

  function bind(root) {
    var pauseBtn = root.querySelector("#game-pause");
    if (pauseBtn) pauseBtn.addEventListener("click", pause);
    var rollBtn = root.querySelector("#game-roll");
    if (rollBtn) rollBtn.addEventListener("click", YZ.Game.rollPlayer);
    var clearBtn = root.querySelector("#game-clear");
    if (clearBtn) clearBtn.addEventListener("click", YZ.Game.clearHolds);
    var bestBtn = root.querySelector("#game-best");
    if (bestBtn) bestBtn.addEventListener("click", YZ.Game.scoreBest);
    root.querySelectorAll("[data-die-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        YZ.Game.toggleHold(Number(button.getAttribute("data-die-index")));
      });
    });
    root.querySelectorAll("[data-score-key]").forEach(function (button) {
      button.addEventListener("click", function () {
        YZ.Game.scorePlayer(button.getAttribute("data-score-key"));
      });
    });
  }

  async function showResultDialog(result) {
    if (!result || resultDialogOpen || lastResultId === result.finishedAt) return;
    resultDialogOpen = true;
    lastResultId = result.finishedAt;
    var choice = await YZ.Effects.choice(
      t("result." + result.outcome),
      t("result.body", { player: result.player, ai: result.ai }),
      [
        { label: "↻ " + t("result.playAgain"), value: "new", className: "btn--secondary" },
        { label: "⌂ " + t("common.menu"), value: "menu", className: "btn--primary" }
      ]
    );
    resultDialogOpen = false;
    if (choice === "new") {
      YZ.Game.newGame(YZ.Settings.get("difficulty"));
      YZ.ScreenManager.show("game");
    } else {
      YZ.ScreenManager.show("menu");
    }
  }

  return {
    render: render,
    showResultDialog: showResultDialog
  };
})();
