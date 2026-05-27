import { DIFFICULTIES } from "../utils/constants.js";
import { drawCanvasPreview, el, formatTime, getDifficultyById, makeButton } from "../utils/helpers.js";
import { enterScreen } from "../ui/Transitions.js";

export class VictoryScreen {
  constructor(app, data = {}) {
    this.app = app;
    this.data = data;
    this.previewCanvas = null;
  }

  render() {
    const difficulty = getDifficultyById(DIFFICULTIES, this.data.difficultyId);
    this.previewCanvas = el("canvas", { attrs: { width: 360, height: 360 } });

    const screen = el("main", { className: "screen victory-screen" }, [
      el("section", { className: "victory-panel surface" }, [
        el("span", { className: "screen-kicker", text: "Completed" }),
        el("h1", { text: "完成拼圖" }),
        el("div", { className: "victory-preview" }, [this.previewCanvas]),
        el("div", { className: "result-grid" }, [
          el("div", { className: "result-stat" }, [
            el("span", { text: "時間" }),
            el("strong", { text: formatTime(this.data.elapsedSeconds || 0) })
          ]),
          el("div", { className: "result-stat" }, [
            el("span", { text: "難度" }),
            el("strong", { text: difficulty.zh })
          ]),
          el("div", { className: "result-stat" }, [
            el("span", { text: this.data.isNewBest ? "新紀錄" : "最佳" }),
            el("strong", { text: this.data.bestSeconds ? formatTime(this.data.bestSeconds) : "--:--" })
          ])
        ]),
        el("div", { className: "toolbar" }, [
          makeButton("再玩一次", { variant: "primary", on: { click: () => this.app.restartCurrentGame() } }),
          makeButton("主選單", { on: { click: () => this.app.navigate("main-menu") } })
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    drawCanvasPreview(this.data.imageCanvas || this.app.getDefaultCanvas(), this.previewCanvas);
  }
}
