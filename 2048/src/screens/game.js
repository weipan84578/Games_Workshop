const GameScreen = (() => {
  let timerInterval = null;
  let elapsedSeconds = 0;
  let paused = false;
  let wonOnce = false;

  const SAVE_KEY = '2048_save';

  function start(resume = false) {
    paused = false;
    wonOnce = false;

    if (resume && localStorage.getItem(SAVE_KEY)) {
      Game.deserialize(localStorage.getItem(SAVE_KEY));
    } else {
      Game.init();
      elapsedSeconds = 0;
    }

    const state = Game.getState();
    Renderer.buildBoard(state.size);
    Renderer.render(state.grid, null);
    updateHUD(state);
    setupControls();
    startTimer();
    AudioEngine.startBgm();
    InputHandler.setCallback(handleMove);
  }

  function setupControls() {
    document.getElementById('btn-back').onclick = () => {
      AudioEngine.buttonClick();
      saveGame();
      AudioEngine.stopBgm();
      stopTimer();
      App.showScreen('home');
      HomeScreen.refresh();
    };

    document.getElementById('btn-restart').onclick = () => {
      AudioEngine.buttonClick();
      confirmRestart();
    };

    document.getElementById('btn-undo').onclick = () => {
      const result = Game.undo();
      if (result) {
        AudioEngine.undoSound();
        const state = Game.getState();
        Renderer.render(state.grid, null);
        updateHUD(state);
      }
    };

    document.getElementById('btn-pause').onclick = () => togglePause();

    document.getElementById('btn-mute-game').onclick = () => {
      const muted = !AudioEngine.isMuted();
      AudioEngine.setMuted(muted);
      SettingsStore.set('muted', muted);
      document.getElementById('btn-mute-game').textContent = muted ? '🔇' : '🔊';
      document.getElementById('btn-mute-home').textContent = muted ? '🔇' : '🔊';
    };

    document.getElementById('btn-resume').onclick = () => {
      AudioEngine.buttonClick();
      togglePause();
    };
    document.getElementById('btn-pause-restart').onclick = () => {
      AudioEngine.buttonClick();
      hidePause();
      confirmRestart();
    };
    document.getElementById('btn-pause-home').onclick = () => {
      AudioEngine.buttonClick();
      hidePause();
      saveGame();
      AudioEngine.stopBgm();
      stopTimer();
      App.showScreen('home');
      HomeScreen.refresh();
    };

    document.getElementById('btn-win-continue').onclick = () => {
      AudioEngine.buttonClick();
      document.getElementById('overlay-win').classList.add('hidden');
    };
    document.getElementById('btn-win-restart').onclick = () => {
      AudioEngine.buttonClick();
      document.getElementById('overlay-win').classList.add('hidden');
      doRestart();
    };
    document.getElementById('btn-win-home').onclick = () => {
      AudioEngine.buttonClick();
      document.getElementById('overlay-win').classList.add('hidden');
      goHome();
    };

    document.getElementById('btn-go-restart').onclick = () => {
      AudioEngine.buttonClick();
      document.getElementById('overlay-gameover').classList.add('hidden');
      doRestart();
    };
    document.getElementById('btn-go-home').onclick = () => {
      AudioEngine.buttonClick();
      document.getElementById('overlay-gameover').classList.add('hidden');
      goHome();
    };

    const muted = AudioEngine.isMuted();
    document.getElementById('btn-mute-game').textContent = muted ? '🔇' : '🔊';
    document.getElementById('btn-undo').disabled = false;

    document.getElementById('timer-box').style.display =
      SettingsStore.get('showTimer') ? '' : 'none';
  }

  function handleMove(dir) {
    if (paused) return;
    const state = Game.getState();
    if (state.over) return;
    if (state.won && !SettingsStore.get('continueAfterWin')) return;

    const result = Game.move(dir);
    if (!result.moved) return;

    const newState = Game.getState();
    Renderer.render(newState.grid, state.grid, result.merged, result.newTile);

    if (result.merged.length) AudioEngine.merge(Math.max(...result.merged.map(m => m.val)));
    else if (result.moved) AudioEngine.slide();
    if (result.newTile) AudioEngine.newTile();

    if (result.gained > 0) {
      const { gained } = result;
      setTimeout(() => {
        const tiles = document.querySelectorAll('.tile');
        if (tiles.length) Animation.spawnScoreFloat(tiles[tiles.length - 1], gained);
      }, 50);
    }

    const prevBest = ScoresStore.getBest();
    updateHUD(newState);

    if (newState.score > prevBest && newState.score > 0 && newState.score !== prevBest) {
      AudioEngine.newRecord();
    }

    if (newState.won && !wonOnce) {
      wonOnce = true;
      AudioEngine.win();
      Animation.spawnConfetti();
      setTimeout(() => showWin(newState), 400);
    }

    if (newState.over) {
      saveRecord(newState);
      setTimeout(() => showGameOver(newState), 400);
    } else {
      saveGame();
    }
  }

  function showWin(state) {
    document.getElementById('win-msg').textContent =
      `你達成了 ${SettingsStore.get('goal')}！分數：${state.score.toLocaleString()}`;
    const continueBtn = document.getElementById('btn-win-continue');
    continueBtn.style.display = SettingsStore.get('continueAfterWin') ? '' : 'none';
    document.getElementById('overlay-win').classList.remove('hidden');
  }

  function showGameOver(state) {
    AudioEngine.gameOver();
    document.getElementById('gameover-msg').textContent =
      `最終分數：${state.score.toLocaleString()}，最大方塊：${Game.maxTile()}`;
    document.getElementById('overlay-gameover').classList.remove('hidden');
  }

  function updateHUD(state) {
    document.getElementById('score').textContent = state.score.toLocaleString();
    const best = Math.max(ScoresStore.getBest(), state.score);
    document.getElementById('best-score').textContent = best.toLocaleString();
    document.getElementById('moves').textContent = state.moves;

    const undoBtn = document.getElementById('btn-undo');
    const undoLimit = SettingsStore.get('undoLimit');
    undoBtn.disabled = state.undoCount === 0 || undoLimit === 0;
  }

  function startTimer() {
    stopTimer();
    if (!SettingsStore.get('showTimer')) return;
    timerInterval = setInterval(() => {
      if (!paused) {
        elapsedSeconds++;
        const m = Math.floor(elapsedSeconds / 60);
        const s = elapsedSeconds % 60;
        document.getElementById('timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function togglePause() {
    paused = !paused;
    if (paused) {
      document.getElementById('overlay-pause').classList.remove('hidden');
      AudioEngine.stopBgm();
    } else {
      hidePause();
      AudioEngine.startBgm();
    }
  }

  function hidePause() {
    paused = false;
    document.getElementById('overlay-pause').classList.add('hidden');
  }

  function confirmRestart() {
    App.confirm('確定要重新開始嗎？', doRestart);
  }

  function doRestart() {
    localStorage.removeItem(SAVE_KEY);
    wonOnce = false;
    elapsedSeconds = 0;
    Game.init();
    const state = Game.getState();
    Renderer.buildBoard(state.size);
    Renderer.render(state.grid, null);
    updateHUD(state);
    startTimer();
    AudioEngine.startBgm();
  }

  function goHome() {
    saveGame();
    AudioEngine.stopBgm();
    stopTimer();
    App.showScreen('home');
    HomeScreen.refresh();
  }

  function saveGame() {
    const state = Game.getState();
    if (state.over) { localStorage.removeItem(SAVE_KEY); return; }
    localStorage.setItem(SAVE_KEY, Game.serialize());
  }

  function saveRecord(state) {
    ScoresStore.saveRecord({
      score: state.score,
      maxTile: Game.maxTile(),
      moves: state.moves,
      time: elapsedSeconds,
      size: state.size,
      won: state.won,
      date: new Date().toLocaleDateString('zh-TW'),
    });
    localStorage.removeItem(SAVE_KEY);
  }

  return { start };
})();
