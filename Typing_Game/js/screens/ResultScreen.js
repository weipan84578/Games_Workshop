import { DifficultyManager } from "../game/DifficultyManager.js";
import { formatDate, formatNumber, formatPercent, formatTime } from "../utils/Formatter.js";

export class ResultScreen {
  constructor(app) {
    this.app = app;
    this.root = null;
  }

  mount({ result = null } = {}) {
    const activeResult = result ?? this.app.state.currentResult;
    this.root = document.createElement("section");
    this.root.id = "result";
    this.root.className = "screen result-screen";

    if (!activeResult) {
      this.root.innerHTML = `
        <div class="panel panel-pad">
          <h1 class="screen-title">尚無結果</h1>
          <p class="muted">先完成一場遊戲即可查看統計。</p>
          <button class="btn btn-primary" type="button" data-action="menu" style="margin-top: var(--space-4)">回主選單</button>
        </div>
      `;
    } else {
      const shareText = this.buildShareText(activeResult);
      this.root.innerHTML = `
        <div class="result-hero">
          <section class="panel result-rank">
            <span class="rank-letter">${activeResult.rank}</span>
            <div>
              <h1 class="screen-title">${activeResult.isNewRecord ? "新紀錄" : "本局完成"}</h1>
              <p class="muted">${DifficultyManager.label(activeResult.settings.difficulty)} / ${formatDate(activeResult.finishedAt)}</p>
            </div>
            <div class="toolbar">
              <button class="btn btn-primary" type="button" data-action="retry">再玩一次</button>
              <button class="btn" type="button" data-action="new">重新設定</button>
              <button class="btn btn-ghost" type="button" data-action="menu">主選單</button>
            </div>
          </section>

          <section class="panel panel-pad">
            <div class="score-grid">
              <div class="score-tile"><span class="score-label">WPM</span><strong class="score-value">${activeResult.wpm}</strong></div>
              <div class="score-tile"><span class="score-label">準確率</span><strong class="score-value">${formatPercent(activeResult.accuracy)}</strong></div>
              <div class="score-tile"><span class="score-label">分數</span><strong class="score-value">${activeResult.score}</strong></div>
              <div class="score-tile"><span class="score-label">最高連擊</span><strong class="score-value">${activeResult.maxCombo}</strong></div>
              <div class="score-tile"><span class="score-label">完成字</span><strong class="score-value">${activeResult.wordsCompleted}</strong></div>
              <div class="score-tile"><span class="score-label">正確字元</span><strong class="score-value">${activeResult.correctChars}</strong></div>
              <div class="score-tile"><span class="score-label">錯誤字元</span><strong class="score-value">${activeResult.wrongChars}</strong></div>
              <div class="score-tile"><span class="score-label">用時</span><strong class="score-value">${formatTime(activeResult.elapsedSeconds)}</strong></div>
            </div>
            <div class="share-box" style="margin-top: var(--space-5)" data-field="share">${shareText}</div>
            <div class="toolbar" style="margin-top: var(--space-4)">
              <button class="btn" type="button" data-action="share">複製戰績</button>
              <button class="btn" type="button" data-action="settings">設定</button>
            </div>
          </section>
        </div>
      `;
    }

    this.root.addEventListener("click", this.handleClick);
    return this.root;
  }

  buildShareText(result) {
    return `Typing Master ${result.rank} Rank | ${result.wpm} WPM | ${formatNumber(result.accuracy, 1)}% | ${result.score} pts | ${DifficultyManager.label(result.settings.difficulty)}`;
  }

  handleClick = async (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    this.app.audio.playSfx("buttonClick");
    const result = this.app.state.currentResult;
    if (action === "menu") this.app.go("menu");
    if (action === "settings") this.app.go("settings");
    if (action === "retry" && result) this.app.go("game", { settings: result.settings });
    if (action === "new") this.app.go("menu");
    if (action === "share") {
      const text = this.root.querySelector("[data-field='share']").textContent;
      try {
        await navigator.clipboard.writeText(text);
        this.app.showToast("已複製戰績", "success");
      } catch {
        this.app.showToast("瀏覽器不允許直接複製，請手動選取戰績文字", "warning");
      }
    }
  };

  unmount() {
    this.root?.removeEventListener("click", this.handleClick);
  }
}
