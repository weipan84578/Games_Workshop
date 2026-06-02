const TABS = {
  rules: {
    label: "遊戲規則",
    html: `
      <div class="help-grid">
        <div class="help-item"><h3 class="section-title">輸入目前單字</h3><p class="muted">照畫面中央的字元逐一輸入。正確字元會變綠，錯誤字元會變紅。</p></div>
        <div class="help-item"><h3 class="section-title">完成單字</h3><p class="muted">整個單字完全相同後會自動切換下一題，並獲得單字完成加分。</p></div>
        <div class="help-item"><h3 class="section-title">日文假名</h3><p class="muted">平假名與片假名模式必須輸入日文假名本身，不能直接輸入英文羅馬拼音。</p></div>
        <div class="help-item"><h3 class="section-title">WPM</h3><p class="muted">WPM 以正確字元除以 5 後換算每分鐘字數。</p></div>
        <div class="help-item"><h3 class="section-title">準確率</h3><p class="muted">準確率 = 正確字元 / 全部輸入字元。錯字即使修正也會計入。</p></div>
      </div>
    `,
  },
  advanced: {
    label: "進階玩法",
    html: `
      <div class="help-grid">
        <div class="help-item"><h3 class="section-title">Combo</h3><p class="muted">連續正確輸入會累積 Combo，10、25、50、100 會觸發提示與加分倍率。</p></div>
        <div class="help-item"><h3 class="section-title">Hard</h3><p class="muted">Hard 會混入大寫與數字，分數倍率提高，錯誤會扣時間。</p></div>
        <div class="help-item"><h3 class="section-title">Hell</h3><p class="muted">Hell 會增加標點、反轉與高時間懲罰，適合熟練後挑戰。</p></div>
        <div class="help-item"><h3 class="section-title">無限模式</h3><p class="muted">無限模式不倒數，手動結束後仍會計算 WPM、準確率與紀錄。</p></div>
      </div>
    `,
  },
  scoring: {
    label: "計分",
    html: `
      <div class="help-grid">
        <div class="help-item"><h3 class="section-title">字元分</h3><p class="muted">每個正確字元有基礎分，會乘上 Combo 與難度倍率。</p></div>
        <div class="help-item"><h3 class="section-title">單字完成</h3><p class="muted">完成單字會依單字長度、Combo 與難度倍率再加分。</p></div>
        <div class="help-item"><h3 class="section-title">時間獎勵</h3><p class="muted">限時模式結束時會依剩餘秒數給額外分數。</p></div>
        <div class="help-item"><h3 class="section-title">本機紀錄</h3><p class="muted">每個難度保存最佳 WPM 與分數，最近 50 場保存於 localStorage。</p></div>
      </div>
    `,
  },
  shortcuts: {
    label: "快捷鍵",
    html: `
      <div class="shortcut-list">
        <div class="shortcut"><kbd>Esc</kbd><span>暫停或關閉彈窗</span></div>
        <div class="shortcut"><kbd>Tab</kbd><span>回到打字輸入區</span></div>
        <div class="shortcut"><kbd>F1</kbd><span>開啟教學</span></div>
        <div class="shortcut"><kbd>M</kbd><span>靜音或恢復音效</span></div>
        <div class="shortcut"><kbd>Ctrl + R</kbd><span>遊戲中重新開始目前設定</span></div>
      </div>
    `,
  },
};

export class TutorialScreen {
  constructor(app) {
    this.app = app;
    this.root = null;
    this.active = "rules";
  }

  mount() {
    this.root = document.createElement("section");
    this.root.id = "tutorial";
    this.root.className = "screen tutorial-screen";
    this.render();
    this.root.addEventListener("click", this.handleClick);
    return this.root;
  }

  render() {
    this.root.innerHTML = `
      <header class="screen-header">
        <div>
          <h1 class="screen-title">教學</h1>
          <p class="muted">打字流程、計分規則與快捷鍵。</p>
        </div>
        <button class="btn" type="button" data-action="menu">回主選單</button>
      </header>
      <section class="panel panel-pad">
        <div class="tabs" role="tablist">
          ${Object.entries(TABS).map(([key, tab]) => `
            <button class="btn ${this.active === key ? "btn-primary" : ""}" type="button" data-tab="${key}" aria-pressed="${String(this.active === key)}">${tab.label}</button>
          `).join("")}
        </div>
        <div class="tab-panel" style="margin-top: var(--space-5)">
          ${TABS[this.active].html}
        </div>
      </section>
    `;
  }

  handleClick = (event) => {
    const tab = event.target.closest("[data-tab]")?.dataset.tab;
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (tab) {
      this.app.audio.playSfx("buttonClick");
      this.active = tab;
      this.render();
    }
    if (action === "menu") this.app.go("menu");
  };

  unmount() {
    this.root?.removeEventListener("click", this.handleClick);
  }
}
