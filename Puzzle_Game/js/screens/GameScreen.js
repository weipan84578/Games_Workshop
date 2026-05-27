import { DIFFICULTIES } from "../utils/constants.js";
import { el, formatTime, getDifficultyById, makeButton } from "../utils/helpers.js";
import { DragController } from "../game/DragController.js";
import { PuzzleEngine } from "../game/PuzzleEngine.js";
import { Timer } from "../game/Timer.js";
import { enterScreen } from "../ui/Transitions.js";

export class GameScreen {
  constructor(app, data = {}) {
    this.app = app;
    this.snapshot = data.snapshot || null;
    this.engine = null;
    this.dragController = null;
    this.timer = null;
    this.completed = false;
    this.paused = false;
    this.resizeTimer = null;
    this.saveTimer = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render() {
    const config = this.app.state.gameConfig;
    const difficulty = getDifficultyById(DIFFICULTIES, config.difficultyId);
    this.timerEl = el("span", { text: "00:00" });
    this.progressEl = el("span", { text: `0/${difficulty.pieces}` });
    this.pauseOverlay = el("div", { className: "pause-overlay", text: "暫停" });
    this.canvas = el("canvas", { id: "puzzle-canvas", attrs: { width: 720, height: 720, "aria-label": "拼圖遊戲板" } });

    this.pauseButton = makeButton("暫停", { on: { click: () => this.togglePause() } });

    const screen = el("main", { className: "game-screen" }, [
      el("div", { className: "game-shell" }, [
        el("header", { className: "game-hud surface" }, [
          makeButton("主選單", { on: { click: () => this.app.navigate("main-menu") } }),
          el("div", { className: "game-title" }, [
            el("strong", { text: "拼圖挑戰" }),
            el("span", { className: "hud-stat" }, ["時間 ", this.timerEl]),
            el("span", { className: "hud-stat" }, [`${difficulty.zh} `, el("span", { text: `${difficulty.cols}×${difficulty.cols}` })]),
            el("span", { className: "hud-stat" }, ["進度 ", this.progressEl])
          ]),
          makeButton("設定", { on: { click: () => this.app.navigate("settings") } })
        ]),
        el("section", { className: "game-board-wrap" }, [
          el("div", { className: "canvas-frame" }, [
            this.canvas,
            this.pauseOverlay
          ]),
          el("div", { className: "canvas-status", text: this.app.state.imageName })
        ]),
        el("div", { className: "game-toolbar surface" }, [
          this.pauseButton,
          makeButton("打亂", { on: { click: () => this.engine?.shuffleUnsolved() } }),
          makeButton("提示", { on: { click: () => this.engine?.showHint() } }),
          makeButton("重開", { on: { click: () => this.app.restartCurrentGame() } })
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    const config = this.app.state.gameConfig;
    const difficulty = getDifficultyById(DIFFICULTIES, config.difficultyId);
    const sourceCanvas = this.app.state.imageCanvas || this.app.getDefaultCanvas();

    this.engine = new PuzzleEngine({
      canvas: this.canvas,
      sourceCanvas,
      difficulty,
      sfx: this.app.sfx,
      onChange: () => this.scheduleSave(),
      onSolvedChange: (solved, total) => {
        this.progressEl.textContent = `${solved}/${total}`;
      },
      onVictory: () => this.finish()
    });
    this.engine.init(this.snapshot);

    this.dragController = new DragController(this.canvas, this.engine, {
      onInteraction: () => this.app.unlockAudio()
    });
    this.dragController.attach();

    this.timer = new Timer({
      startAt: this.snapshot?.elapsedSeconds || 0,
      onTick: (seconds) => {
        this.timerEl.textContent = formatTime(seconds);
        if (seconds > 0 && seconds % 5 === 0) this.scheduleSave();
      }
    });
    this.timer.start();

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  destroy() {
    if (!this.completed) this.persist();
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.resizeTimer);
    clearTimeout(this.saveTimer);
    this.timer?.stop();
    this.dragController?.destroy();
    this.engine?.destroy();
  }

  persist() {
    if (!this.engine || !this.timer) return;
    this.app.saveCurrentGame({
      engineSnapshot: this.engine.serialize(),
      elapsedSeconds: this.timer.getElapsedSeconds()
    });
  }

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.persist(), 200);
  }

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.engine?.resize(), 120);
  }

  handleKeyDown(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

    if (event.code === "Space") {
      event.preventDefault();
      this.togglePause();
    }
    if (event.key === "Escape") {
      this.app.navigate("main-menu");
    }
  }

  togglePause() {
    this.paused = !this.paused;
    this.app.sfx.play(this.paused ? "pause" : "resume");
    this.engine?.setPaused(this.paused);
    this.pauseOverlay.classList.toggle("is-visible", this.paused);
    this.pauseButton.textContent = this.paused ? "繼續" : "暫停";
    if (this.paused) this.timer?.pause();
    else this.timer?.resume();
  }

  finish() {
    if (this.completed) return;
    this.completed = true;
    this.timer?.stop();
    this.app.finishGame({
      elapsedSeconds: this.timer.getElapsedSeconds(),
      difficultyId: this.app.state.gameConfig.difficultyId,
      imageCanvas: this.app.state.imageCanvas,
      imageName: this.app.state.imageName
    });
  }
}
