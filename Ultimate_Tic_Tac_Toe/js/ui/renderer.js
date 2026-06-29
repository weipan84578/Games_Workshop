(function () {
  "use strict";

  function isLastMove(state, br, bc, cr, cc) {
    var last = state.lastMove;
    return !!last && last.br === br && last.bc === bc && last.cr === cr && last.cc === cc;
  }

  function ariaForCell(state, br, bc, cr, cc, value, valid) {
    var base = window.I18n.t("board.cell", { br: br + 1, bc: bc + 1, cr: cr + 1, cc: cc + 1 });
    var status = value ? window.I18n.t("board.occupied", { player: value }) :
      valid ? window.I18n.t("board.open") : window.I18n.t("game.invalid");
    return base + ", " + status;
  }

  function createCell(state, br, bc, cr, cc) {
    var value = state.boards[br][bc][cr][cc];
    var valid = state.currentPlayer === "X" && !state.aiThinking && window.Rules.isValidMove(state, br, bc, cr, cc);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "cell" + (isLastMove(state, br, bc, cr, cc) ? " last-move" : "");
    button.dataset.br = br;
    button.dataset.bc = bc;
    button.dataset.cr = cr;
    button.dataset.cc = cc;
    button.disabled = !valid;
    button.setAttribute("aria-label", ariaForCell(state, br, bc, cr, cc, value, valid));

    if (value) {
      var piece = document.createElement("span");
      piece.className = "piece " + value.toLowerCase();
      piece.textContent = value;
      button.appendChild(piece);
    } else {
      var preview = document.createElement("span");
      preview.className = "piece-preview";
      preview.textContent = "X";
      button.appendChild(preview);
    }
    return button;
  }

  function createWinLine(lineIndex, className) {
    var line = document.createElement("span");
    line.className = className + " line-" + lineIndex;
    return line;
  }

  function renderMiniBoard(state, br, bc) {
    var board = document.createElement("div");
    var result = state.megaBoard[br][bc];
    var playable = window.Rules.isBoardPlayable(state, br, bc);
    var target = state.nextBoard && state.nextBoard.br === br && state.nextBoard.bc === bc && playable;
    board.className = "mini-board" +
      (playable ? " playable" : "") +
      (target ? " target" : "") +
      (result ? " complete" : "");
    board.dataset.br = br;
    board.dataset.bc = bc;

    for (var cr = 0; cr < 3; cr += 1) {
      for (var cc = 0; cc < 3; cc += 1) {
        board.appendChild(createCell(state, br, bc, cr, cc));
      }
    }

    if (result) {
      var winner = document.createElement("div");
      winner.className = "mini-winner " + result.toLowerCase();
      winner.textContent = result === "draw" ? "–" : result;
      board.appendChild(winner);
      if (state.smallWinLines[br][bc] !== null && state.smallWinLines[br][bc] !== undefined) {
        board.appendChild(createWinLine(state.smallWinLines[br][bc], "mini-win-line"));
      }
    }
    return board;
  }

  function render(state) {
    var root = document.getElementById("mega-board");
    if (!root) return;
    root.innerHTML = "";
    root.classList.toggle("ai-thinking", !!state.aiThinking);
    for (var br = 0; br < 3; br += 1) {
      for (var bc = 0; bc < 3; bc += 1) {
        root.appendChild(renderMiniBoard(state, br, bc));
      }
    }
    if (state.megaWinLine !== null && state.megaWinLine !== undefined) {
      root.appendChild(createWinLine(state.megaWinLine, "mega-win-line"));
    }
  }

  window.Renderer = {
    render: render
  };
})();
