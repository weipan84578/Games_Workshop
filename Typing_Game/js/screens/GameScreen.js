import { GameEngine } from "../game/GameEngine.js";
import { DifficultyManager } from "../game/DifficultyManager.js";
import { KeyboardVisualizer } from "../ui/KeyboardVisualizer.js";
import { formatNumber, formatPercent, formatTime } from "../utils/Formatter.js";
import { escapeHTML } from "../utils/helpers.js";

export class GameScreen {
  constructor(app) {
    this.app = app;
    this.root = null;
    this.engine = null;
    this.input = null;
    this.keyboard = null;
    this.cleanup = [];
    this.lastAutoSave = 0;
    this.paused = false;
  }

  mount({ settings = null, snapshot = null } = {}) {
    const activeSettings = { ...this.app.state.getSettings(), ...(settings ?? snapshot?.settings ?? {}) };
    this.root = document.createElement("section");
    this.root.id = "game";
    this.root.className = "screen game-screen";
    this.root.innerHTML = `
      <header class="panel game-hud">
        <div class="hud-stack">
          <strong>${DifficultyManager.label(activeSettings.difficulty)} / ${this.languageLabel(activeSettings.language)}</strong>
          <span class="muted">${activeSettings.gameDuration > 0 ? `${activeSettings.gameDuration} 秒挑戰` : "無限模式"}</span>
        </div>
        <div class="hud-stack">
          <div class="hud-line">
            <span>時間 <strong class="mono" data-field="time">--:--</strong></span>
            <span>進度</span>
          </div>
          <div class="progress" aria-label="時間進度"><span data-field="progress"></span></div>
        </div>
        <div class="hud-line" style="justify-content: flex-end">
          <span>分數 <strong class="mono" data-field="score">0</strong></span>
          <span>WPM <strong class="mono" data-field="wpm">0</strong></span>
          <button class="btn icon-btn" type="button" data-action="pause" aria-label="暫停">II</button>
        </div>
      </header>

      <section class="panel game-stage" aria-label="遊戲區">
        <div class="score-grid" style="width: min(720px, 100%)">
          <div class="score-tile"><span class="score-label">準確率</span><strong class="score-value" data-field="accuracy">100%</strong></div>
          <div class="score-tile"><span class="score-label">連擊</span><strong class="score-value" data-field="combo">0</strong></div>
          <div class="score-tile"><span class="score-label">完成字</span><strong class="score-value" data-field="words">0</strong></div>
          <div class="score-tile"><span class="score-label">錯誤</span><strong class="score-value" data-field="errors">0</strong></div>
        </div>
        <div class="target-word" data-field="word"></div>
        <input class="input-preview game-input" data-field="hiddenInput" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" placeholder="準備開始" aria-label="打字輸入">
        <div class="combo-badge" data-field="comboBadge">Combo x0</div>
      </section>

      <footer class="game-footer">
        <div data-field="keyboard"></div>
        <p class="muted" style="text-align: center">Esc 暫停，Backspace 修正，Tab 回到輸入區。</p>
      </footer>
    `;

    this.input = this.root.querySelector("[data-field='hiddenInput']");
    this.keyboard = new KeyboardVisualizer(this.root.querySelector("[data-field='keyboard']"));
    if (activeSettings.showVirtualKeyboard) {
      this.keyboard.render();
    }

    this.engine = new GameEngine({
      settings: activeSettings,
      snapshot,
      audio: this.app.audio,
      onUpdate: (view) => this.updateView(view),
      onFinish: (result) => this.finish(result),
      onCombo: (milestone) => this.handleCombo(milestone),
    });

    this.bindEvents();
    this.updateView(this.engine.getViewState());

    if (snapshot) {
      this.engine.start();
      this.focusInput();
      this.app.showToast("已載入儲存進度", "success");
    } else {
      this.runCountdown().then(() => {
        this.app.audio.playSfx("gameStart");
        this.engine.start();
        this.focusInput();
      });
    }

    return this.root;
  }

  bindEvents() {
    this.root.addEventListener("click", this.handleClick);
    this.input.addEventListener("input", this.handleInput);
    this.input.addEventListener("compositionstart", this.handleCompositionStart);
    this.input.addEventListener("compositionend", this.handleCompositionEnd);
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("pointerdown", this.focusInput);
    window.addEventListener("beforeunload", this.saveBeforeUnload);
    this.cleanup.push(() => this.root?.removeEventListener("click", this.handleClick));
    this.cleanup.push(() => this.input?.removeEventListener("input", this.handleInput));
    this.cleanup.push(() => this.input?.removeEventListener("compositionstart", this.handleCompositionStart));
    this.cleanup.push(() => this.input?.removeEventListener("compositionend", this.handleCompositionEnd));
    this.cleanup.push(() => document.removeEventListener("keydown", this.handleKeydown));
    this.cleanup.push(() => document.removeEventListener("pointerdown", this.focusInput));
    this.cleanup.push(() => window.removeEventListener("beforeunload", this.saveBeforeUnload));
  }

  handleClick = (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "pause") this.openPauseModal();
    this.focusInput();
  };

  handleCompositionStart = () => {
    this.composing = true;
  };

  handleCompositionEnd = () => {
    this.composing = false;
    this.handleInput();
  };

  handleInput = () => {
    if (this.composing || !this.engine) return;
    if (this.suppressNextInputEvent) {
      this.suppressNextInputEvent = false;
      this.input.value = this.engine.input;
      return;
    }
    const current = this.engine.input;
    const value = this.input.value;
    const currentChars = [...current];
    const valueChars = [...value];

    if (valueChars.length > currentChars.length) {
      const additions = valueChars.slice(currentChars.length);
      for (const char of additions) {
        this.engine.typeChar(char);
        this.keyboard?.flash(char);
      }
    } else if (valueChars.length < currentChars.length) {
      const count = currentChars.length - valueChars.length;
      for (let index = 0; index < count; index += 1) {
        this.engine.backspace();
      }
    }
    this.input.value = this.engine.input;
  };

  handleKeydown = (event) => {
    if (!this.engine) return;
    if (this.app.modal.overlay.classList.contains("is-open")) return;
    if (this.composing || event.isComposing || event.keyCode === 229) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.openPauseModal();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      this.focusInput();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
      event.preventDefault();
      this.restart();
      return;
    }
    if (event.key === "Backspace") {
      if (document.activeElement === this.input) return;
      event.preventDefault();
      this.engine.backspace();
      this.input.value = this.engine.input;
      return;
    }
    if (this.shouldHandlePrintableKey(event)) {
      event.preventDefault();
      this.suppressNextInputEvent = true;
      window.setTimeout(() => {
        this.suppressNextInputEvent = false;
      }, 0);
      this.engine.typeChar(event.key);
      this.keyboard?.flash(event.key);
      this.input.value = this.engine.input;
    }
  };

  shouldHandlePrintableKey(event) {
    return (
      this.engine?.status === "playing" &&
      document.activeElement !== this.input &&
      !["zh", "mixed"].includes(this.engine.settings.language) &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.isComposing &&
      event.key.length === 1
    );
  }

  focusInput = () => {
    if (!this.input || this.app.modal.overlay.classList.contains("is-open")) return;
    this.input.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  saveBeforeUnload = () => {
    if (this.engine && this.engine.status === "playing") {
      this.app.state.saveGame(this.engine.serialize());
    }
  };

  async runCountdown() {
    for (const label of ["3", "2", "1", "GO!"]) {
      this.app.audio.playSfx(label === "GO!" ? "gameStart" : "countdown");
      const overlay = document.createElement("div");
      overlay.className = "countdown";
      overlay.textContent = label;
      document.body.append(overlay);
      await new Promise((resolve) => window.setTimeout(resolve, 720));
      overlay.remove();
    }
  }

  updateView(view) {
    if (!this.root) return;
    this.root.querySelector("[data-field='time']").textContent = view.settings.gameDuration > 0 ? formatTime(view.timeRemaining) : formatTime(view.elapsedSeconds);
    this.root.querySelector("[data-field='progress']").style.setProperty("--progress", `${Math.max(0, Math.min(100, view.progress * 100))}%`);
    this.root.querySelector("[data-field='score']").textContent = String(view.score);
    this.root.querySelector("[data-field='wpm']").textContent = view.settings.showLiveWPM ? String(Math.round(view.wpm)) : "--";
    this.root.querySelector("[data-field='accuracy']").textContent = formatPercent(view.accuracy);
    this.root.querySelector("[data-field='combo']").textContent = String(view.combo);
    this.root.querySelector("[data-field='words']").textContent = String(view.wordsCompleted);
    this.root.querySelector("[data-field='errors']").textContent = String(view.wrongChars);
    this.root.querySelector("[data-field='comboBadge']").textContent = `Combo x${view.combo}`;
    this.renderWord(view.currentWord, view.input);
    this.input.placeholder = view.status === "playing" ? "輸入目前單字" : "準備開始";
    if (!this.composing) {
      this.input.value = view.input;
    }
    const nextKey = [...view.currentWord][[...view.input].length];
    this.keyboard?.setNext(nextKey);

    if (view.status === "playing" && view.elapsedSeconds - this.lastAutoSave > 5) {
      this.lastAutoSave = view.elapsedSeconds;
      this.app.state.saveGame(this.engine.serialize());
    }
  }

  renderWord(word, input) {
    const wordChars = [...word];
    const inputChars = [...input];
    const html = wordChars.map((char, index) => {
      let className = "";
      if (index < inputChars.length) className = inputChars[index] === char ? "correct" : "wrong";
      if (index === inputChars.length) className = `${className} cursor`.trim();
      return `<span class="${className}">${escapeHTML(char)}</span>`;
    }).join("");
    this.root.querySelector("[data-field='word']").innerHTML = html;
  }

  async openPauseModal() {
    if (this.paused || !this.engine || this.engine.status !== "playing") return;
    this.paused = true;
    this.engine.pause();
    this.app.state.saveGame(this.engine.serialize());
    const choice = await this.app.openModal({
      title: "暫停",
      body: `<p class="muted">目前進度已寫入 localStorage，可以返回主選單後繼續。</p>`,
      actions: [
        { label: "繼續", value: "resume", className: "btn btn-primary" },
        { label: "重新開始", value: "restart", className: "btn" },
        { label: "儲存並回主選單", value: "menu", className: "btn" },
        { label: "結束本局", value: "finish", className: "btn btn-danger" },
      ],
    });
    this.paused = false;
    if (choice === "resume" || choice === null) {
      this.engine.resume();
      this.focusInput();
    }
    if (choice === "restart") this.restart();
    if (choice === "menu") this.app.go("menu");
    if (choice === "finish") this.engine.finish("manual");
  }

  restart() {
    const settings = this.engine.settings;
    this.app.state.clearSavedGame();
    this.engine.stop();
    this.app.go("game", { settings });
  }

  handleCombo(milestone) {
    if (!this.app.state.getSettings().enableComboEffect) return;
    this.app.showToast(`Combo x${milestone}`, "success", 1200);
  }

  finish(result) {
    this.app.state.clearSavedGame();
    this.app.state.setCurrentResult(result);
    const { isNewRecord } = this.app.state.pushHistory(result);
    if (isNewRecord) {
      this.app.audio.playSfx("newRecord");
      result.isNewRecord = true;
    }
    this.app.go("result", { result });
  }

  languageLabel(language) {
    return { en: "English", zh: "中文", num: "數字", mixed: "混合" }[language] ?? "English";
  }

  unmount() {
    this.engine?.stop();
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
  }
}
