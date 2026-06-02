import { DifficultyManager } from "../game/DifficultyManager.js";
import { formatDate } from "../utils/Formatter.js";

const LANGUAGE_LABELS = {
  en: "English",
  zh: "中文",
  num: "數字",
  mixed: "混合",
};

const DIFFICULTY_DESCRIPTIONS = {
  easy: "慢速練習，適合暖身",
  normal: "標準速度與計分",
  hard: "更高倍率，會混入變形字",
  hell: "高倍率、高懲罰與突發字型",
};

const DURATION_LABELS = {
  60: "60 秒",
  120: "120 秒",
  0: "無限模式",
};

export class MenuScreen {
  constructor(app) {
    this.app = app;
    this.root = null;
  }

  mount() {
    const settings = this.app.state.getSettings();
    const savedGame = this.app.state.getSavedGame();
    const records = this.app.state.getRecords();
    const bestRecord = Object.entries(records)
      .sort(([, a], [, b]) => b.wpm - a.wpm)[0];

    this.root = document.createElement("section");
    this.root.id = "menu";
    this.root.className = "screen menu-screen";
    this.root.innerHTML = `
      <div class="menu-hero">
        <section class="panel brand-panel">
          <svg class="logo-mark" viewBox="0 0 760 210" role="img" aria-label="Typing Master">
            <rect x="24" y="26" width="712" height="156" rx="8" fill="none" stroke="currentColor" stroke-width="5" opacity="0.55"></rect>
            <path d="M86 146 L116 68 L148 146 M99 116 H135" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path>
            <text x="190" y="106" fill="currentColor" font-size="54">TYPING</text>
            <text x="190" y="158" fill="currentColor" font-size="42" opacity="0.78">MASTER</text>
            <path d="M615 60 h64 v36 h-64 z M590 114 h104 v36 H590 z" fill="currentColor" opacity="0.2"></path>
          </svg>
          <div>
            <h1 class="display-title">Typing Master</h1>
            <p class="menu-copy">純前端打字訓練遊戲。選擇語言、難度與時間，透過 WPM、準確率、Combo 與本機紀錄追蹤進步。</p>
          </div>
          <div class="toolbar">
            <span class="combo-badge">Theme: ${settings.theme}</span>
            <span class="combo-badge">Mode: ${DifficultyManager.label(settings.difficulty)}</span>
          </div>
        </section>

        <aside class="menu-side">
          <section class="panel panel-pad menu-actions" aria-label="主選單">
            <button class="btn btn-primary" type="button" data-action="start" data-autofocus>開始遊戲</button>
            <button class="btn" type="button" data-action="resume" ${savedGame ? "" : "disabled"}>繼續遊戲</button>
            <button class="btn" type="button" data-action="tutorial">教學</button>
            <button class="btn" type="button" data-action="settings">設定</button>
            <button class="btn btn-ghost" type="button" data-action="mute">${this.app.audio.muted ? "恢復音效" : "靜音"}</button>
          </section>

          <section class="panel panel-pad">
            <h2 class="section-title">最佳紀錄</h2>
            <div class="record-list" style="margin-top: var(--space-4)">
              ${this.renderRecord(bestRecord)}
              ${savedGame ? `<div class="record-row"><span>已儲存進度</span><strong>${DifficultyManager.label(savedGame.settings?.difficulty)}</strong></div>` : `<p class="muted">尚無可繼續的遊戲。</p>`}
            </div>
          </section>
        </aside>
      </div>
    `;

    this.root.addEventListener("click", this.handleClick);
    return this.root;
  }

  renderRecord(recordPair) {
    if (!recordPair) return `<p class="muted">完成一場遊戲後會建立紀錄。</p>`;
    const [difficulty, record] = recordPair;
    if (!record?.wpm) return `<p class="muted">完成一場遊戲後會建立紀錄。</p>`;
    return `
      <div class="record-row">
        <span>${DifficultyManager.label(difficulty)} / ${formatDate(record.date)}</span>
        <strong class="mono">${record.wpm} WPM</strong>
      </div>
      <div class="record-row">
        <span>準確率</span>
        <strong class="mono">${record.accuracy}%</strong>
      </div>
      <div class="record-row">
        <span>分數</span>
        <strong class="mono">${record.score}</strong>
      </div>
    `;
  }

  handleClick = async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    this.app.audio.playSfx("buttonClick");
    const action = button.dataset.action;
    if (action === "start") {
      await this.openStartModal();
    }
    if (action === "resume") {
      const savedGame = this.app.state.getSavedGame();
      if (!savedGame) return;
      this.app.applySettings(savedGame.settings ?? {});
      this.app.go("game", { settings: this.app.state.getSettings(), snapshot: savedGame });
    }
    if (action === "tutorial") this.app.go("tutorial");
    if (action === "settings") this.app.go("settings");
    if (action === "mute") {
      this.app.audio.toggleMute();
      button.textContent = this.app.audio.muted ? "恢復音效" : "靜音";
    }
  };

  async openStartModal() {
    const selected = this.app.state.getSettings();
    const body = document.createElement("div");
    body.className = "start-options";
    body.innerHTML = `
      ${this.renderChoices("language", "語言", LANGUAGE_LABELS, selected.language)}
      ${this.renderChoices("difficulty", "難度", {
        easy: "Easy",
        normal: "Normal",
        hard: "Hard",
        hell: "Hell",
      }, selected.difficulty, DIFFICULTY_DESCRIPTIONS)}
      ${this.renderChoices("gameDuration", "時間", DURATION_LABELS, selected.gameDuration)}
    `;

    body.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-choice]");
      if (!choice) return;
      const group = choice.dataset.group;
      const value = group === "gameDuration" ? Number(choice.dataset.choice) : choice.dataset.choice;
      selected[group] = value;
      for (const item of body.querySelectorAll(`[data-group="${group}"]`)) {
        item.setAttribute("aria-pressed", String(item === choice));
      }
    });

    const result = await this.app.openModal({
      title: "開始設定",
      body,
      actions: [
        { label: "取消", value: "cancel", className: "btn btn-ghost" },
        { label: "開始", value: "start", className: "btn btn-primary" },
      ],
    });

    if (result === "start") {
      this.app.state.clearSavedGame();
      this.app.applySettings(selected);
      this.app.state.lastGameOptions = { ...selected };
      this.app.go("game", { settings: this.app.state.getSettings() });
    }
  }

  renderChoices(group, label, choices, selectedValue, descriptions = {}) {
    const entries = Object.entries(choices);
    return `
      <div class="option-group">
        <h3 class="section-title">${label}</h3>
        <div class="choice-grid">
          ${entries.map(([value, text]) => `
            <button class="choice-card" type="button" data-group="${group}" data-choice="${value}" aria-pressed="${String(value == selectedValue)}">
              <strong>${text}</strong>
              ${descriptions[value] ? `<small>${descriptions[value]}</small>` : ""}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  unmount() {
    this.root?.removeEventListener("click", this.handleClick);
  }
}
