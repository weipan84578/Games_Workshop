(function registerGameLoop(app) {
  "use strict";

  let root = null;
  let gameState = null;
  let slots = [];
  let slotElements = [];
  let rafId = 0;
  let messageElement = null;
  let progressElement = null;
  let scoreElement = null;
  let timeElement = null;
  let starsElement = null;
  let completedElement = null;

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  function stopLoop() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function renderToolButtons(container) {
    const selectedTool = app.State.get().selectedTool;
    container.innerHTML = app.Config.tools.map((tool) => `
      <button class="btn btn-secondary" type="button" data-tool="${tool.id}" aria-pressed="${selectedTool === tool.id}">
        <span class="icon" aria-hidden="true">${tool.icon}</span>
        <span>${t(tool.key)}</span>
      </button>
    `).join("");
    container.querySelectorAll("[data-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        app.State.setSelectedTool(button.dataset.tool);
        app.AudioManager.playSfx("button");
        syncToolButtons();
      });
    });
  }

  function syncToolButtons() {
    const selectedTool = app.State.get().selectedTool;
    root?.querySelectorAll("[data-tool]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.tool === selectedTool));
    });
    app.MobileControls.sync();
  }

  function setMessage(key, params) {
    if (messageElement) {
      messageElement.textContent = t(key, params);
    }
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const rest = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function renderShell() {
    root.innerHTML = `
      <div class="game-frame">
        <header class="hud">
          <button class="btn btn-quiet icon-btn" type="button" data-action="back" aria-label="${t("action_back")}">
            <span class="icon" aria-hidden="true">←</span>
          </button>
          <div>
            <div class="hud-metrics">
              <span class="hud-chip"><span class="icon" aria-hidden="true">🏮</span><span>${t("game_level", { level: gameState.level.id })}</span></span>
              <span class="hud-chip"><span>${t("game_score")}</span><span data-score>${gameState.score}</span></span>
              <span class="hud-chip"><span>${t("game_time")}</span><span data-time>${formatTime(gameState.timeLeft)}</span></span>
              <span class="hud-chip"><span>${t("game_stars")}</span><span class="stars" data-stars></span></span>
            </div>
            <p class="hud-message" data-message>${t("msg_start")}</p>
          </div>
          <button class="btn btn-quiet icon-btn" type="button" data-action="save" aria-label="${t("msg_saved")}">
            <span class="icon" aria-hidden="true">💾</span>
          </button>
        </header>
        <div class="game-viewport">
          <section class="stove-scene" aria-label="${t("app_title")}">
            <div class="stall-decor" aria-hidden="true"></div>
            <div class="stove-board" data-slots="${gameState.level.slots}" data-board></div>
          </section>
          <aside class="side-panel">
            <section class="order-board">
              <h3>${t("game_order")}</h3>
              <p>${t("game_order_body", { target: gameState.level.target })}</p>
              <div class="level-progress" aria-hidden="true"><span data-progress></span></div>
              <p><strong data-completed>${gameState.completed}/${gameState.level.target}</strong></p>
            </section>
            <section class="tool-tray">
              <h3>${t("game_tool_title")}</h3>
              <div class="tool-list" data-tool-list></div>
            </section>
          </aside>
        </div>
        <div data-mobile-controls></div>
      </div>
    `;
    messageElement = root.querySelector("[data-message]");
    progressElement = root.querySelector("[data-progress]");
    scoreElement = root.querySelector("[data-score]");
    timeElement = root.querySelector("[data-time]");
    starsElement = root.querySelector("[data-stars]");
    completedElement = root.querySelector("[data-completed]");
    root.querySelector("[data-action='back']").addEventListener("click", () => {
      app.AudioManager.playSfx("button");
      app.State.saveGame();
      app.ScreenManager.show("main-menu");
      app.MainMenu.render();
    });
    root.querySelector("[data-action='save']").addEventListener("click", () => {
      app.AudioManager.playSfx("star");
      app.State.saveGame();
      setMessage("msg_saved");
    });
    renderToolButtons(root.querySelector("[data-tool-list]"));
    renderSlots();
    app.MobileControls.mount(root.querySelector("[data-mobile-controls]"));
  }

  function renderSlots() {
    const board = root.querySelector("[data-board]");
    board.innerHTML = "";
    slotElements = slots.map((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "takoyaki-slot";
      button.dataset.index = String(slot.id);
      button.innerHTML = `
        <span class="takoyaki-ball" aria-hidden="true">
          <span class="ingredient-badges">
            <span class="ingredient-badge ingredient-badge-octopus">🐙</span>
            <span class="ingredient-badge ingredient-badge-sauce">🍯</span>
          </span>
          <span class="steam"></span>
          <span class="bonito"><span></span><span></span><span></span></span>
        </span>
      `;
      button.addEventListener("click", () => applyTool(slot));
      board.append(button);
      return button;
    });
    syncSlots(performance.now());
  }

  function syncSlots(now) {
    slots.forEach((slot, index) => {
      const element = slotElements[index];
      element.dataset.state = slot.state;
      element.classList.toggle("has-octopus", slot.hasOctopus);
      element.classList.toggle("has-topping", slot.hasTopping);
      element.classList.toggle("has-sauce", slot.sauced);
      element.classList.toggle("is-ready", slot.isReady());
      element.classList.toggle("is-warning", slot.isWarning(now));
      element.setAttribute("aria-label", `${t("app_title")} ${index + 1}: ${slot.state}`);
    });
  }

  function syncHud() {
    scoreElement.textContent = String(gameState.score);
    timeElement.textContent = formatTime(gameState.timeLeft);
    const progress = Math.min(1, gameState.completed / gameState.level.target);
    progressElement.style.width = `${Math.round(progress * 100)}%`;
    completedElement.textContent = `${gameState.completed}/${gameState.level.target}`;
    starsElement.innerHTML = Array.from({ length: 3 }, (_, index) => {
      return `<span class="star" aria-hidden="true">${index < gameState.stars ? "★" : "☆"}</span>`;
    }).join("");
  }

  function applyTool(slot) {
    if (!gameState || gameState.isComplete) {
      return;
    }
    const now = performance.now();
    const selectedTool = app.State.get().selectedTool;
    const result = slot.applyAction(selectedTool, now);
    app.AudioManager.playSfx(result.sfx);
    if (result.penalty) {
      gameState.score = Math.max(0, gameState.score + app.Scoring.scoreBurnPenalty());
    }
    if (result.completed) {
      gameState.completed += 1;
      gameState.score += result.score;
      gameState.stars = app.Scoring.starsForLevel(gameState.score, gameState.level.target);
      app.Animations.burstStars(root.querySelector(".stove-scene"));
      if (gameState.completed % 2 === 0) {
        app.State.saveGame();
      }
    }
    setMessage(result.cue);
    syncSlots(now);
    syncHud();
    if (gameState.completed >= gameState.level.target) {
      completeLevel();
    }
  }

  function completeLevel() {
    if (gameState.isComplete) {
      return;
    }
    gameState.isComplete = true;
    gameState.stars = app.Scoring.starsForLevel(gameState.score, gameState.level.target);
    app.State.saveGame();
    app.AudioManager.playCelebration();
    syncHud();
    app.ScreenManager.confirm({
      titleKey: "result_title",
      bodyKey: "result_body",
      bodyParams: { completed: gameState.completed, stars: gameState.stars },
      confirmKey: "result_next_level",
      cancelKey: "action_menu"
    }).then((next) => {
      if (next) {
        const nextLevel = app.OrderSystem.getNextLevel(gameState.level.id);
        app.GameLoop.startNew(nextLevel.id);
      } else {
        app.ScreenManager.show("main-menu");
        app.MainMenu.render();
      }
    });
  }

  function tick(now) {
    if (!gameState || app.State.get().screen !== "game") {
      return;
    }
    if (!gameState.lastTick) {
      gameState.lastTick = now;
    }
    const delta = (now - gameState.lastTick) / 1000;
    gameState.lastTick = now;
    if (!gameState.isComplete) {
      gameState.timeLeft = Math.max(0, gameState.timeLeft - delta);
    }
    slots.forEach((slot) => {
      const update = slot.update(now);
      if (update.changed) {
        if (update.cue) {
          setMessage(update.cue);
        }
        if (update.sfx) {
          app.AudioManager.playSfx(update.sfx);
        }
        if (update.penalty) {
          gameState.score = Math.max(0, gameState.score + app.Scoring.scoreBurnPenalty());
        }
      }
    });
    if (gameState.timeLeft <= 0 && !gameState.isComplete) {
      completeLevel();
    }
    syncSlots(now);
    syncHud();
    rafId = window.requestAnimationFrame(tick);
  }

  function start(levelId, progress) {
    stopLoop();
    root = document.getElementById("screen-game");
    gameState = app.OrderSystem.createGameState(levelId, progress);
    slots = Array.from({ length: gameState.level.slots }, (_, index) => new app.TakoyakiSlot(index));
    app.State.setGame(gameState);
    app.State.setSelectedTool("batter");
    renderShell();
    app.ScreenManager.show("game");
    app.AudioManager.playBgm("game");
    syncHud();
    rafId = window.requestAnimationFrame(tick);
  }

  app.GameLoop = {
    startNew(levelId = 1) {
      start(levelId, {});
    },

    continueFrom(progress) {
      start(progress?.levelId || 1, progress || {});
    },

    stop: stopLoop,

    rerender() {
      if (app.State.get().screen === "game" && gameState) {
        renderShell();
        syncHud();
      }
    }
  };

  app.EventBus.on("tool:changed", syncToolButtons);
  app.EventBus.on("i18n:changed", () => app.GameLoop.rerender());
})(window.Takoyaki = window.Takoyaki || {});
