(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function BoardRenderer(options) {
    options = options || {};
    this.aiPits = options.aiPits;
    this.playerPits = options.playerPits;
    this.aiStore = options.aiStore;
    this.playerStore = options.playerStore;
    this.onPitClick = options.onPitClick || function() {};
    this.locked = false;
  }

  BoardRenderer.prototype.setLocked = function(locked) {
    this.locked = Boolean(locked);
  };

  BoardRenderer.prototype.render = function(gameState) {
    if (!gameState) {
      return;
    }
    this.aiPits.innerHTML = "";
    this.playerPits.innerHTML = "";

    var aiOrder = [12, 11, 10, 9, 8, 7];
    var playerOrder = [0, 1, 2, 3, 4, 5];
    var self = this;

    aiOrder.forEach(function(index, displayIndex) {
      self.aiPits.appendChild(self.createPit(gameState, index, "ai", t("aiPit", {
        number: 6 - displayIndex
      })));
    });

    playerOrder.forEach(function(index, displayIndex) {
      self.playerPits.appendChild(self.createPit(gameState, index, "player", t("playerPit", {
        number: displayIndex + 1
      })));
    });

    this.renderStore(this.aiStore, gameState, 13, "ai", t("aiStore"));
    this.renderStore(this.playerStore, gameState, 6, "player", t("playerStore"));
  };

  BoardRenderer.prototype.createPit = function(gameState, index, owner, label) {
    var button = document.createElement("button");
    var count = gameState.board[index];
    var canClick = !this.locked &&
      owner === "player" &&
      gameState.currentTurn === "player" &&
      !gameState.isGameOver &&
      !gameState.isPaused &&
      !gameState.aiThinking &&
      count > 0;

    button.type = "button";
    button.className = "game-board__pit game-board__pit--" + owner;
    if (canClick) {
      button.classList.add("game-board__pit--clickable");
    }
    if (count === 0) {
      button.classList.add("game-board__pit--empty");
    }
    if (gameState.lastMovePath.indexOf(index) !== -1 && gameState.lastMovePath[gameState.lastMovePath.length - 1] === index) {
      button.classList.add("game-board__pit--last");
    }
    button.setAttribute("role", "gridcell");
    button.setAttribute("data-board-index", String(index));
    button.setAttribute("aria-label", t("pitAria", {
      label: label,
      count: count
    }));
    button.setAttribute("aria-disabled", canClick ? "false" : "true");
    button.disabled = !canClick;

    button.appendChild(labelNode(label));
    button.appendChild(stonesNode(count, owner));
    button.appendChild(countNode(count));
    button.addEventListener("click", this.onPitClick.bind(null, index));
    return button;
  };

  BoardRenderer.prototype.renderStore = function(store, gameState, index, owner, label) {
    var count = gameState.board[index];
    store.innerHTML = "";
    store.setAttribute("data-board-index", String(index));
    store.setAttribute("aria-label", t("storeAria", {
      label: label,
      count: count
    }));
    store.appendChild(labelNode(label));
    store.appendChild(stonesNode(count, owner));
    store.appendChild(countNode(count));
  };

  function labelNode(label) {
    var span = document.createElement("span");
    span.className = "pit-label";
    span.textContent = label;
    return span;
  }

  function countNode(count) {
    var span = document.createElement("span");
    span.className = "pit-count";
    span.textContent = String(count);
    return span;
  }

  function stonesNode(count, owner) {
    var field = document.createElement("span");
    var visibleCount = Math.min(count, count > 12 ? 12 : count);
    field.className = "stone-field" + (count > 10 ? " is-dense" : "");
    for (var i = 0; i < visibleCount; i += 1) {
      var stone = document.createElement("span");
      stone.className = "stone stone--" + owner;
      field.appendChild(stone);
    }
    return field;
  }

  function t(key, params) {
    return Mancala.i18n ? Mancala.i18n.t(key, params) : key;
  }

  Mancala.BoardRenderer = BoardRenderer;
})(window);
