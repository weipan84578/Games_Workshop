import { DEFAULT_SETTINGS } from "../core/StateManager.js";

const THEME_OPTIONS = {
  default: "預設",
  neon: "霓虹",
  sakura: "櫻花",
  ocean: "海洋",
  sunset: "夕陽",
  mono: "黑白",
};

const FONT_OPTIONS = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const SFX_SKINS = {
  standard: "標準",
  mechanical: "機械鍵盤",
  soft: "柔和",
  "8bit": "8-bit",
};

const LANGUAGE_OPTIONS = {
  en: "English",
  zh: "中文",
  num: "數字",
  mixed: "混合",
  hira: "平假名",
  kata: "片假名",
};

const DIFFICULTY_OPTIONS = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  hell: "Hell",
};

const DURATION_OPTIONS = {
  60: "60 秒",
  120: "120 秒",
  0: "無限模式",
};

export class SettingsScreen {
  constructor(app) {
    this.app = app;
    this.root = null;
    this.active = "visual";
  }

  mount() {
    this.root = document.createElement("section");
    this.root.id = "settings";
    this.root.className = "screen settings-screen";
    this.render();
    this.root.addEventListener("input", this.handleInput);
    this.root.addEventListener("change", this.handleChange);
    this.root.addEventListener("click", this.handleClick);
    return this.root;
  }

  render() {
    const settings = this.app.state.getSettings();
    this.root.innerHTML = `
      <header class="screen-header">
        <div>
          <h1 class="screen-title">設定</h1>
          <p class="muted">所有設定會自動儲存在 localStorage。</p>
        </div>
        <div class="toolbar">
          <button class="btn" type="button" data-action="export">匯出</button>
          <button class="btn" type="button" data-action="import">匯入</button>
          <button class="btn" type="button" data-action="menu">回主選單</button>
        </div>
      </header>
      <div class="settings-grid">
        <nav class="panel panel-pad settings-nav" aria-label="設定分類">
          ${this.navButton("visual", "視覺")}
          ${this.navButton("audio", "音效")}
          ${this.navButton("game", "遊戲")}
          ${this.navButton("data", "資料")}
        </nav>
        <section class="panel panel-pad settings-panel">
          ${this.renderPanel(settings)}
        </section>
      </div>
    `;
  }

  navButton(key, label) {
    return `<button class="btn ${this.active === key ? "btn-primary" : ""}" type="button" data-section="${key}" aria-pressed="${String(this.active === key)}">${label}</button>`;
  }

  renderPanel(settings) {
    if (this.active === "visual") {
      return `
        ${this.selectRow("theme", "主題色彩", "切換整體配色。", THEME_OPTIONS, settings.theme)}
        ${this.selectRow("fontSize", "字體大小", "調整 UI 與遊戲字體比例。", FONT_OPTIONS, settings.fontSize)}
        ${this.switchRow("animation", "動畫效果", "關閉後會大幅縮短轉場動畫。", settings.animation)}
        ${this.switchRow("showVirtualKeyboard", "虛擬鍵盤", "桌面與平板顯示鍵盤提示。", settings.showVirtualKeyboard)}
      `;
    }
    if (this.active === "audio") {
      return `
        ${this.rangeRow("masterVolume", "主音量", "控制所有音訊。", settings.masterVolume)}
        ${this.rangeRow("bgmVolume", "BGM 音量", "Web Audio 合成背景音。", settings.bgmVolume)}
        ${this.rangeRow("sfxVolume", "SFX 音量", "按鍵、Combo、結算音效。", settings.sfxVolume)}
        ${this.selectRow("sfxSkin", "音效 Skin", "保留擴充欄位，未來可接真實音檔。", SFX_SKINS, settings.sfxSkin)}
        ${this.switchRow("persistBGM", "跨畫面 BGM", "在選單、設定、教學間保持背景音。", settings.persistBGM)}
      `;
    }
    if (this.active === "game") {
      return `
        ${this.selectRow("language", "預設語言", "開始遊戲時預先帶入的語言。", LANGUAGE_OPTIONS, settings.language)}
        ${this.selectRow("difficulty", "預設難度", "開始遊戲時預先帶入的難度。", DIFFICULTY_OPTIONS, settings.difficulty)}
        ${this.selectRow("gameDuration", "預設時間", "開始遊戲時預先帶入的時間。", DURATION_OPTIONS, settings.gameDuration)}
        ${this.switchRow("showLiveWPM", "即時 WPM", "遊戲中顯示即時 WPM。", settings.showLiveWPM)}
        ${this.switchRow("enableShakeOnError", "錯誤提示", "錯字時顯示紅色與震動效果。", settings.enableShakeOnError)}
        ${this.switchRow("enableComboEffect", "Combo 提示", "達成 Combo 門檻時顯示提示。", settings.enableComboEffect)}
      `;
    }
    return `
      <div class="setting-row">
        <div><h2 class="section-title">清除紀錄</h2><p class="muted">清除最近 50 場歷史與各難度最佳紀錄。</p></div>
        <div class="setting-control"><button class="btn btn-danger" type="button" data-action="resetRecords">清除紀錄</button></div>
      </div>
      <div class="setting-row">
        <div><h2 class="section-title">還原全部設定</h2><p class="muted">還原設定、紀錄與儲存進度。</p></div>
        <div class="setting-control"><button class="btn btn-danger" type="button" data-action="resetAll">全部還原</button></div>
      </div>
    `;
  }

  selectRow(key, title, description, options, value) {
    return `
      <div class="setting-row">
        <div><h2 class="section-title">${title}</h2><p class="muted">${description}</p></div>
        <div class="setting-control">
          <select data-setting="${key}">
            ${Object.entries(options).map(([optionValue, label]) => `<option value="${optionValue}" ${optionValue == value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </div>
      </div>
    `;
  }

  rangeRow(key, title, description, value) {
    return `
      <div class="setting-row">
        <div><h2 class="section-title">${title}</h2><p class="muted">${description}</p></div>
        <div class="setting-control">
          <input type="range" min="0" max="100" step="1" value="${value}" data-setting="${key}">
          <output class="mono">${value}</output>
        </div>
      </div>
    `;
  }

  switchRow(key, title, description, value) {
    return `
      <div class="setting-row">
        <div><h2 class="section-title">${title}</h2><p class="muted">${description}</p></div>
        <div class="setting-control">
          <label class="switch">
            <input type="checkbox" data-setting="${key}" ${value ? "checked" : ""}>
            <span></span>
          </label>
        </div>
      </div>
    `;
  }

  handleInput = (event) => {
    const input = event.target.closest("[data-setting]");
    if (!input) return;
    const key = input.dataset.setting;
    if (input.type === "range") {
      input.nextElementSibling.textContent = input.value;
      this.app.applySettings({ [key]: Number(input.value) });
    }
  };

  handleChange = (event) => {
    const input = event.target.closest("[data-setting]");
    if (!input) return;
    const key = input.dataset.setting;
    let value = input.value;
    if (input.type === "checkbox") value = input.checked;
    if (input.type === "range") value = Number(input.value);
    if (key === "gameDuration") value = Number(value);
    this.app.applySettings({ [key]: value });
    this.app.audio.playSfx("buttonClick");
    if (key === "theme" || key === "fontSize" || key === "animation") this.render();
  };

  handleClick = async (event) => {
    const section = event.target.closest("[data-section]")?.dataset.section;
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (section) {
      this.active = section;
      this.app.audio.playSfx("buttonClick");
      this.render();
    }
    if (action === "menu") this.app.go("menu");
    if (action === "export") this.exportData();
    if (action === "import") this.importData();
    if (action === "resetRecords") this.resetRecords();
    if (action === "resetAll") this.resetAll();
  };

  async exportData() {
    const text = JSON.stringify(this.app.state.exportData(), null, 2);
    try {
      await navigator.clipboard.writeText(text);
      this.app.showToast("資料已複製到剪貼簿", "success");
    } catch {
      const body = document.createElement("textarea");
      body.rows = 12;
      body.value = text;
      await this.app.openModal({
        title: "匯出資料",
        body,
        actions: [{ label: "關閉", value: "close", className: "btn btn-primary" }],
      });
    }
  }

  async importData() {
    const textarea = document.createElement("textarea");
    textarea.rows = 12;
    textarea.placeholder = "貼上匯出的 JSON";
    const action = await this.app.openModal({
      title: "匯入資料",
      body: textarea,
      actions: [
        { label: "取消", value: "cancel", className: "btn btn-ghost" },
        { label: "匯入", value: "import", className: "btn btn-primary" },
      ],
    });
    if (action !== "import") return;
    try {
      this.app.state.importData(JSON.parse(textarea.value));
      this.app.theme.apply();
      this.render();
      this.app.showToast("匯入完成", "success");
    } catch (error) {
      this.app.showToast(error.message || "匯入失敗", "danger");
    }
  }

  async resetRecords() {
    const action = await this.app.openModal({
      title: "清除紀錄",
      body: `<p class="muted">這會刪除歷史與最佳紀錄。</p>`,
      actions: [
        { label: "取消", value: "cancel", className: "btn btn-ghost" },
        { label: "清除", value: "reset", className: "btn btn-danger" },
      ],
    });
    if (action === "reset") {
      this.app.state.resetRecords();
      this.app.showToast("紀錄已清除", "success");
    }
  }

  async resetAll() {
    const action = await this.app.openModal({
      title: "全部還原",
      body: `<p class="muted">這會清除設定、紀錄與儲存進度。</p>`,
      actions: [
        { label: "取消", value: "cancel", className: "btn btn-ghost" },
        { label: "還原", value: "reset", className: "btn btn-danger" },
      ],
    });
    if (action === "reset") {
      this.app.state.resetAll();
      this.app.applySettings(DEFAULT_SETTINGS);
      this.render();
      this.app.showToast("已還原預設值", "success");
    }
  }

  unmount() {
    this.root?.removeEventListener("input", this.handleInput);
    this.root?.removeEventListener("change", this.handleChange);
    this.root?.removeEventListener("click", this.handleClick);
  }
}
