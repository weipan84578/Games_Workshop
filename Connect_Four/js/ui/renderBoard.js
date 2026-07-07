(function initRenderBoard(global) {
  const CF = global.CF || (global.CF = {});
  const { ROWS, COLUMNS, PLAYER_ONE, PLAYER_TWO } = CF.constants;

  function isWinningCell(game, row, column) {
    return game.winningLine.some((cell) => cell.row === row && cell.column === column);
  }

  function renderChip(piece) {
    if (!piece) return "";
    return `<span class="chip player-${piece}" aria-hidden="true"></span>`;
  }

  function renderBoard(game, disabled) {
    const t = CF.i18n.t;
    const targetButtons = Array.from({ length: COLUMNS }, (_, column) => {
      const full = CF.board.getAvailableRow(game.board, column) === -1;
      return `<button class="column-button" type="button" data-action="drop" data-column="${column}" ${disabled || full ? "disabled" : ""} aria-label="${t("game.column", { column: column + 1 })}">▼</button>`;
    }).join("");

    const cells = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const piece = game.board[row][column];
        const isLast = game.lastMove && game.lastMove.row === row && game.lastMove.column === column;
        const classes = [
          "cell",
          piece ? `occupied player-${piece}` : "empty",
          isLast ? "last-move" : "",
          isWinningCell(game, row, column) ? "win" : ""
        ].filter(Boolean).join(" ");
        cells.push(`
          <div class="${classes}" data-row="${row}" data-column="${column}">
            ${renderChip(piece)}
            <button class="cell-button" type="button" data-action="drop" data-column="${column}" ${disabled ? "disabled" : ""} aria-label="${t("game.column", { column: column + 1 })}"></button>
          </div>
        `);
      }
    }

    return `
      <div class="board-wrap">
        <div class="column-targets" aria-hidden="${disabled ? "true" : "false"}">${targetButtons}</div>
        <div class="board ${game.lastMove ? "shake" : ""}" role="grid" aria-label="${CF.i18n.t("app.title")}">
          ${cells.join("")}
        </div>
      </div>
    `;
  }

  function playerName(game, piece) {
    return CF.i18n.t(CF.gameState.getPlayerLabel(game, piece));
  }

  function renderPlayerPanel(game, piece) {
    const active = game.currentPlayer === piece && game.status === "playing";
    return `
      <aside class="player-panel ${active ? "active" : ""}">
        <span class="player-token chip player-${piece}" aria-hidden="true"></span>
        <h2>${playerName(game, piece)}</h2>
        <p class="muted">${active ? CF.i18n.t("game.turn", { player: playerName(game, piece) }) : CF.i18n.t("game.moves", { count: CF.i18n.formatNumber(game.moves.length) })}</p>
      </aside>
    `;
  }

  function renderStatus(game, aiThinking) {
    if (aiThinking) {
      return `<div class="status-strip"><strong class="thinking-dots">${CF.i18n.t("game.aiTurn")}</strong></div>`;
    }
    if (game.status === "finished") {
      if (game.winner === "draw") return `<div class="status-strip"><strong>${CF.i18n.t("result.draw")}</strong></div>`;
      return `<div class="status-strip"><strong>${CF.i18n.t("result.playerWin", { player: playerName(game, game.winner) })}</strong></div>`;
    }
    return `<div class="status-strip"><strong>${CF.i18n.t("game.turn", { player: playerName(game, game.currentPlayer) })}</strong><span>${CF.i18n.t("game.moves", { count: CF.i18n.formatNumber(game.moves.length) })}</span></div>`;
  }

  function renderGameScreen(game, settings, aiThinking) {
    const disabled = aiThinking || game.status !== "playing" || (game.mode === "ai" && game.currentPlayer === PLAYER_TWO);
    const musicIcon = settings.bgmMuted ? "icon-music-off.svg" : "icon-music-on.svg";
    const soundIcon = settings.sfxMuted ? "icon-sound-off.svg" : "icon-sound-on.svg";

    return `
      <main class="screen game-screen" data-screen="game">
        <div class="top-bar">
          <button class="button ghost" type="button" data-action="menu">
            <img class="icon-img" src="assets/icons/icon-home.svg" alt="">${CF.i18n.t("game.home")}
          </button>
          ${renderStatus(game, aiThinking)}
        </div>
        <section class="game-layout">
          ${renderPlayerPanel(game, PLAYER_ONE)}
          ${renderBoard(game, disabled)}
          ${renderPlayerPanel(game, PLAYER_TWO)}
        </section>
        <nav class="toolbar" aria-label="Game tools">
          <button class="button secondary" type="button" data-action="undo">
            <img class="icon-img" src="assets/icons/icon-undo.svg" alt="">${CF.i18n.t("game.undo")}
          </button>
          <button class="button secondary" type="button" data-action="restart">
            <img class="icon-img" src="assets/icons/icon-restart.svg" alt="">${CF.i18n.t("game.restart")}
          </button>
          <button class="button secondary" type="button" data-action="pause">${CF.i18n.t("game.pause")}</button>
          <button class="icon-button" type="button" data-action="toggle-bgm" aria-label="${CF.i18n.t("game.music")}">
            <img class="icon-img" src="assets/icons/${musicIcon}" alt="">
          </button>
          <button class="icon-button" type="button" data-action="toggle-sfx" aria-label="${CF.i18n.t("game.sound")}">
            <img class="icon-img" src="assets/icons/${soundIcon}" alt="">
          </button>
        </nav>
      </main>
    `;
  }

  CF.renderBoard = { renderGameScreen };
})(window);
