(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var Rules = NMM.Rules;
  var svg;
  var pointLayer;
  var shell;
  var pointButtons = [];
  var lineElements = {};
  var onPointClick = null;

  function ns(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  function lineKey(a, b) {
    return Math.min(a, b) + "-" + Math.max(a, b);
  }

  function getPosition(index) {
    return C.POSITIONS[index];
  }

  function drawLine(a, b) {
    var pa = getPosition(a);
    var pb = getPosition(b);
    var line = ns("line");
    line.setAttribute("x1", pa.x);
    line.setAttribute("y1", pa.y);
    line.setAttribute("x2", pb.x);
    line.setAttribute("y2", pb.y);
    line.setAttribute("class", "board-line");
    svg.appendChild(line);
    lineElements[lineKey(a, b)] = line;
  }

  function buildLines() {
    var i;
    for (i = 0; i < C.RINGS.length; i += 1) {
      var ring = C.RINGS[i];
      for (var j = 0; j < ring.length; j += 1) {
        drawLine(ring[j], ring[(j + 1) % ring.length]);
      }
    }
    for (i = 0; i < C.CONNECTORS.length; i += 1) {
      drawLine(C.CONNECTORS[i][0], C.CONNECTORS[i][1]);
    }
  }

  function buildPoints() {
    for (var i = 0; i < C.POSITIONS.length; i += 1) {
      var pos = C.POSITIONS[i];
      var button = document.createElement("button");
      button.type = "button";
      button.className = "board-point";
      button.style.left = pos.x + "%";
      button.style.top = pos.y + "%";
      button.setAttribute("data-position", String(pos.id));
      button.setAttribute("data-label", String(pos.id + 1));
      button.addEventListener("click", function (event) {
        if (onPointClick) {
          onPointClick(Number(event.currentTarget.getAttribute("data-position")));
        }
      });
      pointLayer.appendChild(button);
      pointButtons.push(button);
    }
  }

  function init(callback) {
    svg = document.getElementById("board-lines");
    pointLayer = document.getElementById("board-points");
    shell = document.getElementById("board-shell");
    onPointClick = callback;
    if (!svg || !pointLayer || pointButtons.length) {
      return;
    }
    buildLines();
    buildPoints();
  }

  function activeMillSegments(state) {
    var segments = {};
    var playerMills = Rules.getMillsFor(state.board, C.PLAYERS.PLAYER);
    var aiMills = Rules.getMillsFor(state.board, C.PLAYERS.AI);

    function mark(mills, className) {
      for (var i = 0; i < mills.length; i += 1) {
        segments[lineKey(mills[i][0], mills[i][1])] = className;
        segments[lineKey(mills[i][1], mills[i][2])] = className;
      }
    }

    mark(playerMills, "is-mill-player");
    mark(aiMills, "is-mill-ai");
    return segments;
  }

  function renderLines(state) {
    var segments = activeMillSegments(state);
    Object.keys(lineElements).forEach(function (key) {
      lineElements[key].setAttribute("class", "board-line" + (segments[key] ? " " + segments[key] : ""));
    });
  }

  function render(state, uiState) {
    var ui = uiState || {};
    var legal = ui.legalTargets || [];
    var removable = [];
    var last = state.lastMove || {};

    if (state.awaitingRemoval) {
      removable = Rules.getRemovablePieces(state, NMM.GameState.opponent(state.awaitingRemoval.by));
    }

    shell.classList.toggle("is-locked", Boolean(ui.locked));
    renderLines(state);

    for (var i = 0; i < pointButtons.length; i += 1) {
      var button = pointButtons[i];
      var owner = state.board[i];
      var classes = ["board-point"];
      if (owner === C.PLAYERS.PLAYER) {
        classes.push("is-player");
      } else if (owner === C.PLAYERS.AI) {
        classes.push("is-ai");
      } else {
        classes.push("is-empty");
      }
      if (ui.selected === i) {
        classes.push("is-selected");
      }
      if (legal.indexOf(i) >= 0) {
        classes.push("is-legal");
      }
      if (removable.indexOf(i) >= 0 && state.currentTurn === C.PLAYERS.PLAYER) {
        classes.push("is-removable");
      }
      if (last.to === i || last.remove === i) {
        classes.push("is-last");
      }
      button.className = classes.join(" ");
      button.disabled = Boolean(ui.locked);
      button.setAttribute("aria-label", (i + 1) + " " + (owner || "empty"));
    }
  }

  NMM.BoardRenderer = {
    init: init,
    render: render
  };
})(window);
