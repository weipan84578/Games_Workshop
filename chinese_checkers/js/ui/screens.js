function updatePlayers() {
  if (!game) return;
  const bar = document.getElementById("players-bar");
  bar.innerHTML = "";
  game.players.forEach(p => {
    const info = document.createElement("div");
    info.className = "player-info" + (currentPlayer() === p ? " current" : "");
    const count = getPieces(game.board, p).length;
    const aggro = game.aggro[p] || 0;
    const aggroColor = aggro >= 70 ? "var(--danger)" : aggro >= 30 ? "var(--yellow)" : "var(--green)";
    const route = game.assignments[p]
      ? (game.mode === "homecoming"
        ? `<span class="route-chip" style="--chip-color:${PLAYER_META[p].color}">${ZONE_LABELS[game.assignments[p].start]}</span> → <span class="route-chip" style="--chip-color:${PLAYER_META[p].color}">${ZONE_LABELS[game.assignments[p].target]}</span>`
        : `起點 <span class="route-chip" style="--chip-color:${PLAYER_META[p].color}">${ZONE_LABELS[game.assignments[p].start]}</span>`)
      : "";
    info.innerHTML = `
      <div class="player-head"><i class="dot" style="background:${PLAYER_META[p].color}"></i><span class="player-name">${PLAYER_META[p].label}</span></div>
      <div class="meta">${route}</div>
      <div class="meta">棋 ${count}　吃 ${game.captures[p] || 0}</div>
      ${settings.showAggro && game.players.length >= 3 ? `<div class="meta">仇恨 ${aggro}${aggro >= 70 ? " !!" : aggro >= 30 ? " !" : ""}</div><div class="aggro"><i style="width:${aggro}%;background:${aggroColor}"></i></div>` : ""}
    `;
    bar.appendChild(info);
  });
}

function updateHint() {
  if (!game) return;
  const p = currentPlayer();
  if (game.phase === "ai-thinking") hint(PLAYER_META[p].label + " 思考中...");
  else if (p === "red") hint("輪到你。選擇紅棋移動。");
  else hint("輪到 " + PLAYER_META[p].label + "。");
}

function hint(text) { document.getElementById("hint-text").textContent = text; }

function showResult(winner) {
  const isWin = winner === "red";
  document.getElementById("result-mark").textContent = isWin ? "勝" : "敗";
  document.getElementById("result-title").textContent = isWin ? "你贏了" : PLAYER_META[winner].label + " 獲勝";
  document.getElementById("result-summary").textContent = "模式：" + (game.mode === "homecoming" ? "回家模式" : "吃子模式") + "，回合：" + game.round + "。";
  showScreen("result");
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  if (name !== "settings") lastScreen = name;
  if (name === "game") setTimeout(resizeCanvas, 0);
  if (name === "title") drawTitleArt();
  if (name === "setup") updateSetupControls();
}

function setChoice(groupName, value) {
  const group = document.querySelector(`[data-choice="${groupName}"]`);
  if (!group) return;
  group.querySelectorAll(".choice").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === String(value));
  });
}

function updateSetupControls() {
  const four = document.getElementById("players-4-choice");
  const isHome = setup.mode === "homecoming";
  four.classList.toggle("disabled", isHome);
  four.disabled = isHome;
  if (isHome && setup.players > 3) {
    setup.players = 3;
    setChoice("players", 3);
  }
  const note = document.getElementById("setup-note");
  note.innerHTML = isHome
    ? `<span class="route-pill">回家模式最多 3 人</span><span class="route-pill">每局隨機起點</span><span class="route-pill">目標固定為對面營地</span>`
    : `<span class="route-pill">吃子模式支援 2-4 人</span><span class="route-pill">每局隨機起點</span><span class="route-pill">跳過敵棋即可吃子</span>`;
}

function bindChoices() {
  document.querySelectorAll("[data-choice]").forEach(group => {
    group.addEventListener("click", e => {
      const btn = e.target.closest(".choice");
      if (!btn || btn.disabled) return;
      group.querySelectorAll(".choice").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const type = group.dataset.choice;
      setup[type] = type === "players" ? Number(btn.dataset.value) : btn.dataset.value;
      updateSetupControls();
      sfx("tap");
    });
  });
}

function loadSettings() {
  try {
    const saved = localStorage.getItem("cc_settings");
    if (saved) Object.assign(settings, JSON.parse(saved));
  } catch (e) {}
}
function saveSettings() {
  try { localStorage.setItem("cc_settings", JSON.stringify(settings)); } catch (e) {}
}
function applySettings() {
  document.documentElement.style.setProperty("--font-base", FONT_SCALES[settings.fontSize] || FONT_SCALES.L);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.classList.toggle("dark", settings.darkMode === "on" || (settings.darkMode === "auto" && prefersDark));
  document.getElementById("music-volume").value = Math.round(settings.musicVolume * 100);
  document.getElementById("sfx-volume").value = Math.round(settings.sfxVolume * 100);
  document.getElementById("music-muted").textContent = settings.musicMuted ? "開" : "關";
  document.getElementById("sfx-muted").textContent = settings.sfxMuted ? "開" : "關";
  document.getElementById("font-size").value = settings.fontSize;
  document.getElementById("dark-mode").textContent = settings.darkMode === "auto" ? "自動" : settings.darkMode === "on" ? "開" : "關";
  document.getElementById("show-aggro").textContent = settings.showAggro ? "開" : "關";
  document.getElementById("show-hints").textContent = settings.showHints ? "開" : "關";
  if (bgmGain) bgmGain.gain.value = settings.musicMuted ? 0 : settings.musicVolume * .16;
  updatePlayers();
  draw();
}
