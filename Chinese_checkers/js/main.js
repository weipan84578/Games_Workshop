function initEvents() {
  bindChoices();
  document.querySelectorAll("[data-screen]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));
  document.getElementById("new-game-btn").addEventListener("click", () => showScreen("setup"));
  document.getElementById("start-btn").addEventListener("click", newGame);
  document.getElementById("again-btn").addEventListener("click", newGame);
  document.getElementById("restart-btn").addEventListener("click", newGame);
  document.getElementById("back-title").addEventListener("click", () => {
    clearTimeout(aiTimer);
    showScreen("title");
  });
  document.getElementById("rules-btn").addEventListener("click", () => showScreen("rules"));
  document.getElementById("end-chain-btn").addEventListener("click", endChain);
  document.getElementById("settings-back").addEventListener("click", () => {
    saveSettings();
    showScreen(lastScreen || "title");
  });
  document.getElementById("music-volume").addEventListener("input", e => { settings.musicVolume = Number(e.target.value) / 100; applySettings(); saveSettings(); ensureMusic(); });
  document.getElementById("sfx-volume").addEventListener("input", e => { settings.sfxVolume = Number(e.target.value) / 100; applySettings(); saveSettings(); });
  document.getElementById("music-muted").addEventListener("click", () => { settings.musicMuted = !settings.musicMuted; applySettings(); saveSettings(); });
  document.getElementById("sfx-muted").addEventListener("click", () => { settings.sfxMuted = !settings.sfxMuted; applySettings(); saveSettings(); });
  document.getElementById("font-size").addEventListener("change", e => { settings.fontSize = e.target.value; applySettings(); saveSettings(); resizeCanvas(); });
  document.getElementById("dark-mode").addEventListener("click", () => {
    settings.darkMode = settings.darkMode === "auto" ? "on" : settings.darkMode === "on" ? "off" : "auto";
    applySettings(); saveSettings(); drawTitleArt();
  });
  document.getElementById("show-aggro").addEventListener("click", () => { settings.showAggro = !settings.showAggro; applySettings(); saveSettings(); });
  document.getElementById("show-hints").addEventListener("click", () => { settings.showHints = !settings.showHints; applySettings(); saveSettings(); });
  boardCanvas.addEventListener("click", e => {
    const rect = boardCanvas.getBoundingClientRect();
    const scaleX = parseFloat(boardCanvas.style.width) / rect.width;
    const scaleY = parseFloat(boardCanvas.style.height) / rect.height;
    handleClick((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  });
  boardCanvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = boardCanvas.getBoundingClientRect();
    const scaleX = parseFloat(boardCanvas.style.width) / rect.width;
    const scaleY = parseFloat(boardCanvas.style.height) / rect.height;
    handleClick((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY);
  }, { passive: false });
  window.addEventListener("resize", () => {
    clearTimeout(window.__ccResize);
    window.__ccResize = setTimeout(() => { resizeCanvas(); drawTitleArt(); }, 150);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && audioCtx) audioCtx.suspend();
    if (!document.hidden && audioCtx) audioCtx.resume();
  });
}

function init() {
  generateBoard();
  loadSettings();
  initEvents();
  applySettings();
  updateSetupControls();
  drawTitleArt();
  showScreen("title");
}

window.addEventListener("DOMContentLoaded", init);
