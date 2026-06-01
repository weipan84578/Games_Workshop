(function () {
  const difficultyMeta = {
    easy: { name: "簡單", size: "10 x 10", words: "14", hints: 5, icon: "E" },
    medium: { name: "中等", size: "13 x 13", words: "20", hints: 3, icon: "M" },
    hard: { name: "困難", size: "15 x 15", words: "25", hints: 1, icon: "H" },
  };

  let activeInstructionTab = "basics";
  let relaxedMode = false;
  let lastTimedSaveAt = 0;
  let refreshFrameId = 0;
  let refreshMobileClueList = false;
  let lastCommandAt = 0;

  function init() {
    applySettings();
    AudioManager.setBGMVolume(AppState.state.settings.bgmVolume);
    AudioManager.setSFXVolume(AppState.state.settings.sfxVolume);

    renderMainMenu();

    ScreenManager.show("main-menu");
    BgmController.init();

    document.addEventListener(
      "pointerdown",
      () => {
        AudioManager.init();
        AudioManager.playBGM("main_theme", { fadeIn: true, loop: true });
      },
      { once: true, capture: true }
    );

    document.addEventListener("keydown", handleKeyDown);
    document.getElementById("screen-game").addEventListener("click", handleGameClick);
    window.addEventListener("resize", () => {
      if (AppState.state.activeScreen === "game" && AppState.state.model) {
        const root = Helpers.$("#board-root");
        if (root) {
          GridRenderer.applyCellSize(root, AppState.state.model);
        }
      }
    });
  }

  function applySettings() {
    const settings = AppState.state.settings;
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.setAttribute("data-font-size", settings.fontSize);
  }

  function renderMainMenu() {
    const save = GameStorage.loadGame();
    ScreenManager.setContent(
      "main-menu",
      `
      <main class="main-menu">
        <section class="panel menu-panel" aria-label="主選單">
          <div class="brand-lockup">
            <img class="brand-mark" src="assets/images/logo.svg" alt="Crossword">
            <div class="brand-title">
              <h1>CROSSWORD</h1>
              <span>填字遊戲</span>
            </div>
          </div>
          <div class="menu-actions">
            <button class="btn menu-button" type="button" data-action="start">🎮 開始遊戲</button>
            <button class="btn menu-button secondary" type="button" data-action="continue" ${save ? "" : "disabled"}>▶ 繼續遊戲</button>
            <button class="btn menu-button secondary" type="button" data-action="instructions">📖 遊戲說明</button>
            <button class="btn menu-button secondary" type="button" data-action="settings">⚙ 設定</button>
          </div>
          <div class="version-label">v1.0.0</div>
        </section>
      </main>
      `
    );

    Helpers.$("[data-action='start']").addEventListener("click", openDifficultyModal);
    Helpers.$("[data-action='continue']").addEventListener("click", openContinueModal);
    Helpers.$("[data-action='instructions']").addEventListener("click", () => {
      AudioManager.playSFX("click");
      renderInstructions();
      ScreenManager.show("instructions");
    });
    Helpers.$("[data-action='settings']").addEventListener("click", () => {
      AudioManager.playSFX("click");
      renderSettings();
      ScreenManager.show("settings");
    });
  }

  function openDifficultyModal() {
    AudioManager.playSFX("click");
    Modal.open({
      title: "選擇難度",
      body: `
        <div class="difficulty-grid">
          ${Object.entries(difficultyMeta)
            .map(
              ([difficulty, meta]) => `
                <button class="difficulty-card" type="button" data-start-difficulty="${difficulty}">
                  <span class="difficulty-icon">${meta.icon}</span>
                  <span><strong>${meta.name}</strong><br><span class="meta-text">${meta.size} / ${meta.words} 題 / 提示 ${meta.hints}</span></span>
                  <span aria-hidden="true">›</span>
                </button>
              `
            )
            .join("")}
        </div>
      `,
    });

    Helpers.$all("[data-start-difficulty]").forEach((button) => {
      button.addEventListener("click", () => {
        startNewGame(button.dataset.startDifficulty);
      });
    });
  }

  function openContinueModal() {
    const save = GameStorage.loadGame();
    if (!save) {
      return;
    }
    AudioManager.playSFX("click");
    const rawPuzzle = PuzzleEngine.getById(save.puzzleId);
    if (!rawPuzzle) {
      Notify.show("找不到存檔對應的題目", "danger");
      return;
    }
    const model = PuzzleEngine.buildModel(rawPuzzle);
    const userGrid = PuzzleEngine.sanitizeUserGrid(model, save.grid);
    const progress = Solver.completion(model, userGrid);
    Modal.open({
      title: "繼續遊戲",
      body: `
        <div class="settings-grid">
          <div class="panel setting-row">
            <h3>${rawPuzzle.title}</h3>
            <p>${difficultyMeta[rawPuzzle.difficulty].name} / ${Helpers.formatTime(save.elapsedSeconds || 0)} / ${progress.percent}%</p>
            <div class="progress-track"><div class="progress-bar" style="width:${progress.percent}%"></div></div>
          </div>
        </div>
      `,
      actions: `
        <button class="btn secondary" type="button" data-modal-close>取消</button>
        <button class="btn" type="button" data-confirm-continue>繼續</button>
      `,
    });
    Helpers.$("[data-confirm-continue]").addEventListener("click", () => {
      continueGame(save);
    });
  }

  function startNewGame(difficulty) {
    const rawPuzzle = PuzzleEngine.getByDifficulty(difficulty);
    if (!rawPuzzle) {
      Notify.show("此難度尚無題目", "danger");
      return;
    }
    Modal.close();
    AppState.resetGameSession();
    const model = PuzzleEngine.buildModel(rawPuzzle);
    AppState.state.difficulty = difficulty;
    AppState.state.puzzle = rawPuzzle;
    AppState.state.model = model;
    AppState.state.userGrid = PuzzleEngine.createEmptyUserGrid(model);
    AppState.state.hintsRemaining = rawPuzzle.hints;
    AppState.state.elapsedSeconds = 0;
    lastTimedSaveAt = 0;
    selectFirstPlayableCell();
    showGame();
  }

  function continueGame(save) {
    const rawPuzzle = PuzzleEngine.getById(save.puzzleId);
    if (!rawPuzzle) {
      Notify.show("找不到存檔對應的題目", "danger");
      return;
    }
    Modal.close();
    AppState.resetGameSession();
    const model = PuzzleEngine.buildModel(rawPuzzle);
    AppState.state.difficulty = rawPuzzle.difficulty;
    AppState.state.puzzle = rawPuzzle;
    AppState.state.model = model;
    AppState.state.userGrid = PuzzleEngine.sanitizeUserGrid(model, save.grid);
    AppState.state.hintsRemaining = Number.isFinite(save.hintsRemaining) ? save.hintsRemaining : rawPuzzle.hints;
    AppState.state.elapsedSeconds = Number(save.elapsedSeconds) || 0;
    lastTimedSaveAt = AppState.state.elapsedSeconds;
    AppState.state.mistakes = Number(save.mistakes) || 0;
    AppState.state.hintsUsed = Number(save.hintsUsed) || 0;
    selectFirstOpenCell();
    showGame();
  }

  function showGame() {
    renderGame();
    ScreenManager.show("game");
    requestAnimationFrame(() => {
      const root = Helpers.$("#board-root");
      if (root && AppState.state.model) {
        GridRenderer.applyCellSize(root, AppState.state.model);
      }
    });
    GameTimer.start(() => {
      if (AppState.state.activeScreen !== "game") {
        return;
      }
      AppState.state.elapsedSeconds += 1;
      GameTimer.update(AppState.state.elapsedSeconds);
      if (AppState.state.elapsedSeconds - lastTimedSaveAt >= 10) {
        saveCurrentGame();
        lastTimedSaveAt = AppState.state.elapsedSeconds;
      }
    });
  }

  function renderGame() {
    const { model, userGrid, settings } = AppState.state;
    if (!model || !userGrid) {
      return;
    }
    const progress = Solver.completion(model, userGrid);
    ScreenManager.setContent(
      "game",
      `
      <main class="game-shell">
        <header class="game-toolbar">
          <div class="toolbar-group">
            <button class="icon-btn" type="button" data-action="back" title="返回主選單">←</button>
            <div class="puzzle-heading">
              <strong>${model.title}</strong>
              <span>${difficultyMeta[model.difficulty].name} / <span data-direction-label>${Helpers.directionLabel(AppState.state.direction)}</span></span>
            </div>
          </div>
          <div class="toolbar-group">
            ${GameTimer.render(AppState.state.elapsedSeconds, settings.showTimer)}
            <span class="stat-pill wide-stat" title="完成度"><span data-progress-text>${progress.percent}%</span></span>
            <button class="btn secondary" type="button" data-action="hint" title="提示">💡 <span class="toolbar-label">提示</span>x<span data-hint-count>${AppState.state.hintsRemaining}</span></button>
            <button class="btn" type="button" data-action="validate" title="驗證">✓ <span class="toolbar-label">驗證</span></button>
            <button class="icon-btn" type="button" data-action="music" title="切換遊戲音樂"><span data-music-label>${relaxedMode ? "♬" : "♪"}</span></button>
          </div>
        </header>
        <section class="game-content">
          ${CluePanel.render(model, userGrid, AppState.state.activeEntryId, "desktop", AppState.state.direction)}
          <section class="board-region">
            <div id="board-root"></div>
            <span class="stat-pill compact-stat"><span data-progress-text>${progress.percent}%</span></span>
          </section>
          ${CluePanel.render(model, userGrid, AppState.state.activeEntryId, "mobile", AppState.state.direction)}
        </section>
        <footer class="game-footer">
          ${VirtualKeyboard.render()}
        </footer>
      </main>
      `
    );

    const boardRoot = Helpers.$("#board-root");
    GridRenderer.render(boardRoot, model, userGrid, AppState.state);
    GridRenderer.updateProgress(model, userGrid);
  }

  function handleGameClick(event) {
    if (AppState.state.activeScreen !== "game") {
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton && actionButton.closest("#screen-game")) {
      const action = actionButton.dataset.action;
      if (action === "back") {
        AudioManager.playSFX("click");
        leaveGame();
      } else if (action === "hint") {
        if (!canRunCommand(120)) {
          return;
        }
        useHint();
      } else if (action === "validate") {
        if (!canRunCommand(180)) {
          return;
        }
        validatePuzzle();
      } else if (action === "music") {
        if (!canRunCommand(250)) {
          return;
        }
        relaxedMode = !relaxedMode;
        AudioManager.playSFX("click");
        AudioManager.crossfadeBGM(relaxedMode ? "relaxed" : "gameplay");
        refreshGameView();
      }
      return;
    }

    const cellButton = event.target.closest(".cell:not(.black)");
    if (cellButton && cellButton.closest("#screen-game")) {
      const previousDirection = AppState.state.direction;
      selectCell(Number(cellButton.dataset.row), Number(cellButton.dataset.col), { toggleIfSame: true });
      if (previousDirection !== AppState.state.direction) {
        refreshMobileClueList = true;
      }
      AudioManager.playSFX("cell_select");
      refreshGameView();
      return;
    }

    const keyButton = event.target.closest("[data-key]");
    if (keyButton && keyButton.closest("#screen-game")) {
      handleVirtualKey(keyButton.dataset.key);
      return;
    }

    const clueTabButton = event.target.closest("[data-clue-tab]");
    if (clueTabButton && clueTabButton.closest("#screen-game")) {
      AppState.state.direction = clueTabButton.dataset.clueTab;
      alignSelectionToDirection();
      AudioManager.playSFX("direction_toggle");
      refreshMobileClueList = true;
      refreshGameView();
      return;
    }

    const entryButton = event.target.closest("[data-entry-id]");
    if (entryButton && entryButton.closest("#screen-game")) {
      const previousDirection = AppState.state.direction;
      selectEntry(entryButton.dataset.entryId);
      if (previousDirection !== AppState.state.direction) {
        refreshMobileClueList = true;
      }
      AudioManager.playSFX("cell_select");
      refreshGameView();
    }
  }

  function refreshGameView() {
    if (refreshFrameId) {
      return;
    }
    refreshFrameId = requestAnimationFrame(() => {
      refreshFrameId = 0;
      flushGameRefresh();
    });
  }

  function flushGameRefresh() {
    const { model, userGrid } = AppState.state;
    if (!model || !userGrid) {
      return;
    }

    const boardRoot = Helpers.$("#board-root");
    if (boardRoot) {
      GridRenderer.refresh(boardRoot, model, userGrid, AppState.state);
    }

    const progress = Solver.completion(model, userGrid);
    Helpers.$all("[data-direction-label]").forEach((node) => {
      node.textContent = Helpers.directionLabel(AppState.state.direction);
    });
    Helpers.$all("[data-progress-text]").forEach((node) => {
      node.textContent = `${progress.percent}%`;
    });
    Helpers.$all("[data-hint-count]").forEach((node) => {
      node.textContent = AppState.state.hintsRemaining;
    });
    Helpers.$all("[data-music-label]").forEach((node) => {
      node.textContent = relaxedMode ? "♬" : "♪";
    });

    if (refreshMobileClueList) {
      refreshMobileClues();
      refreshMobileClueList = false;
    }
    refreshClueStates();
  }

  function canRunCommand(intervalMs) {
    const now = performance.now();
    if (now - lastCommandAt < intervalMs) {
      return false;
    }
    lastCommandAt = now;
    return true;
  }

  function refreshMobileClues() {
    const mobileClues = Helpers.$("#screen-game .mobile-clues");
    if (!mobileClues || mobileClues.dataset.clueDirection === AppState.state.direction) {
      return;
    }
    mobileClues.outerHTML = CluePanel.render(
      AppState.state.model,
      AppState.state.userGrid,
      AppState.state.activeEntryId,
      "mobile",
      AppState.state.direction
    );
  }

  function refreshClueStates() {
    const { model, userGrid, activeEntryId } = AppState.state;
    Helpers.$all("#screen-game [data-entry-id]").forEach((button) => {
      const entryId = button.dataset.entryId;
      button.classList.toggle("active", entryId === activeEntryId);
      button.classList.toggle("complete", Solver.isEntryComplete(model, userGrid, entryId));
    });
  }

  function leaveGame() {
    saveCurrentGame();
    GameStorage.flushGameSave();
    GameTimer.stop();
    renderMainMenu();
    ScreenManager.show("main-menu");
  }

  function saveCurrentGame() {
    const { model, userGrid } = AppState.state;
    if (!model || !userGrid || AppState.state.completed) {
      return;
    }
    GameStorage.saveGame({
      puzzleId: model.id,
      difficulty: model.difficulty,
      grid: userGrid,
      hintsRemaining: AppState.state.hintsRemaining,
      elapsedSeconds: AppState.state.elapsedSeconds,
      mistakes: AppState.state.mistakes,
      hintsUsed: AppState.state.hintsUsed,
    });
  }

  function selectFirstPlayableCell() {
    const firstEntry = AppState.state.model.clues.across[0] || AppState.state.model.clues.down[0];
    if (firstEntry) {
      selectEntry(firstEntry.id);
    }
  }

  function selectFirstOpenCell() {
    const { model, userGrid } = AppState.state;
    const open = model.cells.flat().find((cell) => !cell.isBlack && (!userGrid[cell.row][cell.col].letter || !Solver.isCellCorrect(model, userGrid, cell.row, cell.col)));
    if (open) {
      selectCell(open.row, open.col);
    } else {
      selectFirstPlayableCell();
    }
  }

  function selectCell(row, col, options = {}) {
    const model = AppState.state.model;
    const cell = model && model.cells[row] && model.cells[row][col];
    if (!cell || cell.isBlack) {
      return;
    }
    const same = AppState.state.selected && AppState.state.selected.row === row && AppState.state.selected.col === col;
    let direction = AppState.state.direction;
    const entries = cell.entries.map((id) => model.entries.get(id)).filter(Boolean);
    if (same && options.toggleIfSame && entries.length > 1) {
      direction = direction === "across" ? "down" : "across";
    }
    let entry = entries.find((candidate) => candidate.direction === direction) || entries[0];
    direction = entry.direction;
    AppState.state.selected = { row, col };
    AppState.state.direction = direction;
    AppState.state.activeEntryId = entry.id;
  }

  function selectEntry(entryId) {
    const entry = AppState.state.model.entries.get(entryId);
    if (!entry) {
      return;
    }
    const firstEditable = entry.cells.find((cell) => {
      const userCell = AppState.state.userGrid[cell.row][cell.col];
      return userCell && !userCell.revealed && !userCell.letter;
    });
    const target = firstEditable || entry.cells[0];
    AppState.state.direction = entry.direction;
    AppState.state.activeEntryId = entry.id;
    AppState.state.selected = { row: target.row, col: target.col };
  }

  function alignSelectionToDirection() {
    const selected = AppState.state.selected;
    if (!selected) {
      return;
    }
    selectCell(selected.row, selected.col);
  }

  function handleKeyDown(event) {
    if (AppState.state.activeScreen !== "game") {
      if (event.key === "Escape") {
        Modal.close();
      }
      return;
    }
    if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      inputLetter(event.key);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      backspace();
    } else if (event.key === "Enter") {
      event.preventDefault();
      toggleDirection();
    } else if (event.key === "Tab") {
      event.preventDefault();
      moveToAdjacentEntry(event.shiftKey ? -1 : 1);
    } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      moveByArrow(event.key);
    } else if (event.key === "Escape") {
      leaveGame();
    }
  }

  function handleVirtualKey(key) {
    if (key === "BACKSPACE") {
      backspace();
    } else if (key === "ENTER") {
      toggleDirection();
    } else if (key === "TAB") {
      moveToAdjacentEntry(1);
    } else if (/^[A-Z]$/.test(key)) {
      inputLetter(key);
    }
  }

  function inputLetter(letter) {
    const { model, userGrid, selected, settings } = AppState.state;
    if (!model || !selected) {
      return;
    }
    const userCell = userGrid[selected.row][selected.col];
    const answerCell = model.cells[selected.row][selected.col];
    if (!userCell || userCell.revealed) {
      return;
    }
    const nextLetter = letter.toUpperCase();
    userCell.letter = nextLetter;
    const correct = nextLetter === answerCell.answer;
    if (settings.showErrors) {
      userCell.status = correct ? "correct" : "wrong";
    } else {
      userCell.status = "";
    }
    if (!correct) {
      AppState.state.mistakes += 1;
    }
    AudioManager.playSFX(correct ? "type_correct" : "type_wrong");
    if (AppState.state.activeEntryId && Solver.isEntryComplete(model, userGrid, AppState.state.activeEntryId)) {
      AudioManager.playSFX("word_complete");
    }
    saveCurrentGame();
    if (checkVictory()) {
      return;
    }
    moveWithinEntry(1);
    refreshGameView();
  }

  function backspace() {
    const { userGrid, selected } = AppState.state;
    if (!selected) {
      return;
    }
    const userCell = userGrid[selected.row][selected.col];
    if (!userCell || userCell.revealed) {
      return;
    }
    if (userCell.letter) {
      userCell.letter = "";
      userCell.status = "";
    } else {
      moveWithinEntry(-1);
      const nextSelected = AppState.state.selected;
      const previousCell = userGrid[nextSelected.row][nextSelected.col];
      if (previousCell && !previousCell.revealed) {
        previousCell.letter = "";
        previousCell.status = "";
      }
    }
    AudioManager.playSFX("click");
    saveCurrentGame();
    refreshGameView();
  }

  function toggleDirection() {
    const selected = AppState.state.selected;
    if (!selected) {
      return;
    }
    const model = AppState.state.model;
    const cell = model.cells[selected.row][selected.col];
    const current = AppState.state.direction;
    const entries = cell.entries.map((id) => model.entries.get(id)).filter(Boolean);
    const other = entries.find((entry) => entry.direction !== current);
    if (other) {
      AppState.state.direction = other.direction;
      AppState.state.activeEntryId = other.id;
      refreshMobileClueList = true;
      AudioManager.playSFX("direction_toggle");
      refreshGameView();
    }
  }

  function moveWithinEntry(delta) {
    const { model, selected, activeEntryId } = AppState.state;
    const entry = model.entries.get(activeEntryId);
    if (!entry || !selected) {
      return;
    }
    const index = entry.cells.findIndex((cell) => cell.row === selected.row && cell.col === selected.col);
    const target = entry.cells[Helpers.clamp(index + delta, 0, entry.cells.length - 1)];
    if (target) {
      selectCell(target.row, target.col);
    }
  }

  function moveByArrow(key) {
    const deltas = {
      ArrowUp: [-1, 0, "down"],
      ArrowDown: [1, 0, "down"],
      ArrowLeft: [0, -1, "across"],
      ArrowRight: [0, 1, "across"],
    };
    const [rowDelta, colDelta, direction] = deltas[key];
    const { model, selected } = AppState.state;
    if (!model || !selected) {
      return;
    }
    let row = selected.row + rowDelta;
    let col = selected.col + colDelta;
    while (row >= 0 && row < model.rows && col >= 0 && col < model.cols) {
      if (!model.cells[row][col].isBlack) {
        const previousDirection = AppState.state.direction;
        AppState.state.direction = direction;
        selectCell(row, col);
        if (previousDirection !== AppState.state.direction) {
          refreshMobileClueList = true;
        }
        AudioManager.playSFX("cell_select");
        refreshGameView();
        return;
      }
      row += rowDelta;
      col += colDelta;
    }
  }

  function moveToAdjacentEntry(delta) {
    const { model, direction, activeEntryId } = AppState.state;
    const entries = model.clues[direction];
    const currentIndex = entries.findIndex((entry) => entry.id === activeEntryId);
    const index = currentIndex === -1 ? 0 : (currentIndex + delta + entries.length) % entries.length;
    selectEntry(entries[index].id);
    AudioManager.playSFX("cell_select");
    refreshGameView();
  }

  function validatePuzzle() {
    AudioManager.playSFX("click");
    const mistakes = Solver.validateAll(AppState.state.model, AppState.state.userGrid);
    AppState.state.mistakes += mistakes;
    if (checkVictory()) {
      return;
    }
    Notify.show(mistakes ? `還有 ${mistakes} 格需要修正` : "目前填入的字母都正確", mistakes ? "danger" : "success");
    saveCurrentGame();
    refreshGameView();
  }

  function useHint() {
    const { model, userGrid } = AppState.state;
    if (AppState.state.hintsRemaining <= 0) {
      Notify.show("提示已用完", "danger");
      return;
    }
    const entry = model.entries.get(AppState.state.activeEntryId);
    const target =
      findHintTarget(entry, model, userGrid) ||
      findHintTarget({ cells: model.playableCells }, model, userGrid);
    if (!target) {
      Notify.show("沒有可揭示的格子", "success");
      return;
    }
    const userCell = userGrid[target.row][target.col];
    const answerCell = model.cells[target.row][target.col];
    userCell.letter = answerCell.answer;
    userCell.revealed = true;
    userCell.status = "";
    AppState.state.hintsRemaining -= 1;
    AppState.state.hintsUsed += 1;
    selectCell(target.row, target.col);
    AudioManager.playSFX("hint_use");
    saveCurrentGame();
    if (checkVictory()) {
      return;
    }
    refreshGameView();
  }

  function findHintTarget(entry, model, userGrid) {
    if (!entry) {
      return null;
    }
    return entry.cells.find((cell) => {
      const userCell = userGrid[cell.row][cell.col];
      const answerCell = model.cells[cell.row][cell.col];
      return userCell && !userCell.revealed && userCell.letter !== answerCell.answer;
    });
  }

  function checkVictory() {
    if (!Solver.isPuzzleComplete(AppState.state.model, AppState.state.userGrid)) {
      return false;
    }
    AppState.state.completed = true;
    GameTimer.stop();
    GameStorage.clearGame();
    EventBus.emit("puzzle:clear");
    renderVictory();
    ScreenManager.show("victory");
    return true;
  }

  function renderSettings() {
    const settings = AppState.state.settings;
    ScreenManager.setContent(
      "settings",
      `
      <main class="settings-screen">
        <div class="screen-inner">
          <header class="subpage-header">
            <div>
              <div class="eyebrow">Settings</div>
              <h1>設定</h1>
            </div>
            <button class="icon-btn" type="button" data-settings-back title="返回">←</button>
          </header>
          <section class="settings-grid">
            <div class="panel setting-row">
              <div class="setting-topline"><h2>配色主題</h2><span class="meta-text">${themeName(settings.theme)}</span></div>
              <div class="theme-grid">
                ${THEMES.map(
                  (theme) => `
                    <button class="theme-swatch ${settings.theme === theme.id ? "active" : ""}" type="button" data-theme-choice="${theme.id}">
                      <span class="swatch-dot" style="background:${theme.color}"></span>
                      <span>${theme.name}</span>
                    </button>
                  `
                ).join("")}
              </div>
            </div>
            ${rangeRow("背景音樂音量", "bgmVolume", settings.bgmVolume)}
            ${rangeRow("音效音量", "sfxVolume", settings.sfxVolume)}
            ${toggleRow("顯示計時器", "showTimer", settings.showTimer)}
            ${toggleRow("顯示錯誤提示", "showErrors", settings.showErrors)}
            <div class="panel setting-row">
              <div class="setting-topline"><h2>字體大小</h2></div>
              <div class="segmented">
                ${segment("normal", "標準", settings.fontSize)}
                ${segment("large", "大", settings.fontSize)}
                ${segment("xlarge", "特大", settings.fontSize)}
              </div>
            </div>
            <div class="panel setting-row">
              <div class="setting-topline"><h2>語言</h2></div>
              <div class="segmented">
                <button class="segment ${settings.language === "zh-TW" ? "active" : ""}" type="button" data-language="zh-TW">繁中</button>
                <button class="segment ${settings.language === "en" ? "active" : ""}" type="button" data-language="en">English</button>
              </div>
            </div>
          </section>
        </div>
      </main>
      `
    );
    bindSettingsControls();
  }

  function rangeRow(label, key, value) {
    return `
      <div class="panel setting-row">
        <div class="setting-topline"><h2>${label}</h2><strong>${Math.round(value * 100)}</strong></div>
        <input type="range" min="0" max="100" value="${Math.round(value * 100)}" data-range="${key}" aria-label="${label}">
      </div>
    `;
  }

  function toggleRow(label, key, value) {
    return `
      <div class="panel setting-row">
        <div class="setting-topline">
          <h2>${label}</h2>
          <button class="toggle" type="button" aria-pressed="${value}" data-toggle="${key}" title="${label}"></button>
        </div>
      </div>
    `;
  }

  function segment(value, label, current) {
    return `<button class="segment ${value === current ? "active" : ""}" type="button" data-font-size="${value}">${label}</button>`;
  }

  function bindSettingsControls() {
    Helpers.$("[data-settings-back]").addEventListener("click", () => {
      AudioManager.playSFX("click");
      renderMainMenu();
      ScreenManager.show("main-menu");
    });
    Helpers.$all("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        AudioManager.playSFX("click");
        AppState.setSettings({ theme: button.dataset.themeChoice });
        renderSettings();
      });
    });
    Helpers.$all("[data-range]").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.range;
        AppState.setSettings({ [key]: Number(input.value) / 100 });
        input.closest(".setting-row").querySelector("strong").textContent = input.value;
      });
    });
    Helpers.$all("[data-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.toggle;
        AppState.setSettings({ [key]: !AppState.state.settings[key] });
        renderSettings();
      });
    });
    Helpers.$all("[data-font-size]").forEach((button) => {
      button.addEventListener("click", () => {
        AppState.setSettings({ fontSize: button.dataset.fontSize });
        renderSettings();
      });
    });
    Helpers.$all("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        AppState.setSettings({ language: button.dataset.language });
        renderSettings();
      });
    });
  }

  function themeName(id) {
    const theme = THEMES.find((item) => item.id === id);
    return theme ? theme.name : id;
  }

  function renderInstructions() {
    const tabs = [
      ["basics", "基本玩法"],
      ["controls", "操作方式"],
      ["features", "功能介紹"],
      ["themes", "主題切換"],
    ];
    ScreenManager.setContent(
      "instructions",
      `
      <main class="instructions-screen">
        <div class="screen-inner">
          <header class="subpage-header">
            <div>
              <div class="eyebrow">Instructions</div>
              <h1>遊戲說明</h1>
            </div>
            <button class="icon-btn" type="button" data-instructions-back title="返回">←</button>
          </header>
          <nav class="instruction-tabs" aria-label="說明分頁">
            ${tabs.map(([id, label]) => `<button class="segment ${activeInstructionTab === id ? "active" : ""}" type="button" data-instruction-tab="${id}">${label}</button>`).join("")}
          </nav>
          <section class="panel instruction-card">
            ${instructionContent(activeInstructionTab)}
          </section>
        </div>
      </main>
      `
    );
    Helpers.$("[data-instructions-back]").addEventListener("click", () => {
      AudioManager.playSFX("click");
      renderMainMenu();
      ScreenManager.show("main-menu");
    });
    Helpers.$all("[data-instruction-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeInstructionTab = button.dataset.instructionTab;
        AudioManager.playSFX("click");
        renderInstructions();
      });
    });
  }

  function instructionContent(tab) {
    const miniBoard = `
      <div class="mini-board" aria-hidden="true">
        <div class="mini-cell active">C</div><div class="mini-cell">O</div><div class="mini-cell">D</div><div class="mini-cell">E</div>
        <div class="mini-cell">A</div><div class="mini-cell black"></div><div class="mini-cell">A</div><div class="mini-cell black"></div>
        <div class="mini-cell">T</div><div class="mini-cell">E</div><div class="mini-cell">A</div><div class="mini-cell">M</div>
        <div class="mini-cell black"></div><div class="mini-cell">B</div><div class="mini-cell black"></div><div class="mini-cell">E</div>
      </div>
    `;
    const content = {
      basics: `
        <div class="instruction-grid">
          ${miniBoard}
          <div>
            <h2>基本玩法</h2>
            <p>依照橫向與縱向提示，在白格中填入正確英文字母。黑格不可填寫，交會處會共用同一個字母。</p>
          </div>
        </div>
      `,
      controls: `
        <h2>操作方式</h2>
        <p>點選格子或提示可切換目前單字。字母鍵會填入並前進，Backspace 清除，Enter 切換方向，方向鍵移動格子，Tab 前往下一個單字。</p>
      `,
      features: `
        <h2>功能介紹</h2>
        <p>提示會揭示目前單字中的一格，驗證會標示已填入格子的正誤。遊戲會自動計時並在每次輸入後儲存進度。</p>
      `,
      themes: `
        <h2>主題切換</h2>
        <p>設定畫面提供六套配色，切換後立即套用並保存。字體大小、音樂音量、音效音量與錯誤提示也會一併保存。</p>
      `,
    };
    return content[tab] || content.basics;
  }

  function renderVictory() {
    const { model } = AppState.state;
    ScreenManager.setContent(
      "victory",
      `
      <main class="victory-wrap">
        <section class="panel victory-panel">
          <div class="victory-badge">✓</div>
          <div>
            <h1>完成</h1>
            <p>${model.title}</p>
          </div>
          <div class="stat-grid">
            <div class="victory-stat"><span>用時</span><strong>${Helpers.formatTime(AppState.state.elapsedSeconds)}</strong></div>
            <div class="victory-stat"><span>提示</span><strong>${AppState.state.hintsUsed}</strong></div>
            <div class="victory-stat"><span>錯誤</span><strong>${AppState.state.mistakes}</strong></div>
          </div>
          <div class="button-row" style="justify-content:center;">
            <button class="btn" type="button" data-victory-new>再玩一局</button>
            <button class="btn secondary" type="button" data-victory-menu>主選單</button>
          </div>
        </section>
      </main>
      `
    );
    Helpers.$("[data-victory-new]").addEventListener("click", () => {
      AudioManager.playSFX("click");
      openDifficultyModal();
    });
    Helpers.$("[data-victory-menu]").addEventListener("click", () => {
      AudioManager.playSFX("click");
      renderMainMenu();
      ScreenManager.show("main-menu");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
