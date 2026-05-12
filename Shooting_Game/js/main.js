
const audio = new AudioController(GameState.settings);
const fx = new FxPool(document.querySelector("#fx-layer"));
const game = new GameController({ audio, fx });

function init() {
  renderStages();
  bindNavigation();
  bindSettings();
  renderLeaderboard();
  updateMuteButton();
  showScreen("menu");
  GameState.screen = "menu";
}

function renderStages() {
  const list = document.querySelector("#stage-list");
  list.innerHTML = "";
  STAGES.forEach((stage, index) => {
    const button = document.createElement("button");
    button.className = "stage-card";
    button.type = "button";
    button.innerHTML = `
      <strong>${stage.label} ${stage.title}</strong>
      <span>${stage.endless ? "無限時間" : `${stage.seconds} 秒`} / 目標 ${stage.quota === Infinity ? "無限" : stage.quota}</span>
      <small>${stage.boss ? "最終 Boss 戰" : stage.endless ? "隨機混合挑戰" : "固定場景訓練"}</small>
    `;
    button.addEventListener("click", () => {
      audio.unlock();
      game.start(index);
    });
    list.append(button);
  });
}

function bindNavigation() {
  document.addEventListener("pointerdown", () => audio.unlock(), { once: true });
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const screen = button.dataset.screen;
      audio.unlock();
      audio.sfx("reload");
      if (screen !== "gameplay") {
        GameState.paused = false;
        setPauseVisible(false);
      }
      showScreen(screen);
      GameState.screen = screen;
      if (screen === "leaderboard") renderLeaderboard();
      if (screen === "menu") audio.playMusic("menu");
    });
  });
  bindTouchButton("#pause-button", () => game.togglePause(true));
  document.querySelector("#resume-button").addEventListener("click", () => game.togglePause(false));
  bindTouchButton("#reload-button", () => game.reload());
  document.querySelector("#retry-button").addEventListener("click", () => game.start(GameState.activeStageIndex));
  document.querySelector("#next-stage-button").addEventListener("click", () => {
    const next = Math.min(GameState.activeStageIndex + 1, STAGES.length - 2);
    game.start(next);
  });
  document.querySelector("#mute-button").addEventListener("click", () => {
    GameState.settings.muted = !GameState.settings.muted;
    saveSettings(GameState.settings);
    updateMuteButton();
  });
  if (location.protocol === "http:" || location.protocol === "https:") {
    window.addEventListener("popstate", () => history.pushState(null, "", location.href));
    history.pushState(null, "", location.href);
  }
}

function bindTouchButton(selector, action) {
  const button = document.querySelector(selector);
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  }, { passive: false });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  });
}

function bindSettings() {
  const music = document.querySelector("#music-volume");
  const sfx = document.querySelector("#sfx-volume");
  const fxEnabled = document.querySelector("#fx-enabled");
  music.value = GameState.settings.musicVolume;
  sfx.value = GameState.settings.sfxVolume;
  fxEnabled.checked = GameState.settings.fxEnabled;

  music.addEventListener("input", () => updateSetting("musicVolume", Number(music.value)));
  sfx.addEventListener("input", () => updateSetting("sfxVolume", Number(sfx.value)));
  fxEnabled.addEventListener("change", () => updateSetting("fxEnabled", fxEnabled.checked));
  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.difficulty === GameState.settings.difficulty);
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      updateSetting("difficulty", button.dataset.difficulty);
    });
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.language === GameState.settings.language);
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-language]").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      updateSetting("language", button.dataset.language);
    });
  });
}

function updateSetting(key, value) {
  GameState.settings[key] = value;
  saveSettings(GameState.settings);
  audio.setSettings(GameState.settings);
}

function updateMuteButton() {
  document.querySelector("#mute-button").textContent = GameState.settings.muted ? "🔇" : "🔊";
}

function renderLeaderboard() {
  const list = document.querySelector("#leaderboard-list");
  const rows = loadLeaderboard();
  if (rows.length === 0) {
    list.innerHTML = "<li><span>#</span><strong>尚無紀錄</strong><span>開始挑戰</span></li>";
    return;
  }
  list.innerHTML = rows.map((row, index) => `
    <li>
      <span>#${index + 1}</span>
      <strong>${escapeHtml(row.name)} · ${escapeHtml(row.stage)}</strong>
      <span>${Number(row.score).toLocaleString()} / ${row.date}</span>
    </li>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

init();
