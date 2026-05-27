import { el, makeButton } from "../utils/helpers.js";
import { enterScreen } from "../ui/Transitions.js";

export class InstructionsScreen {
  constructor(app) {
    this.app = app;
  }

  render() {
    const steps = [
      ["選擇圖片", "使用預設插畫，或上傳 JPG、PNG、WebP、GIF、BMP。"],
      ["設定難度", "3×3 到 10×10 共六段難度，碎片數越多挑戰越高。"],
      ["拖曳碎片", "用滑鼠或手指拖曳，靠近正確位置時會自動吸附。"],
      ["使用提示", "提示會短暫標出其中一片的正確位置。"],
      ["暫停與返回", "空白鍵暫停，Esc 返回主選單，系統會保存目前進度。"],
      ["完成拼圖", "所有碎片吸附後會進入完成畫面並記錄本次成績。"]
    ];

    const screen = el("main", { className: "screen" }, [
      el("div", { className: "screen-shell stack" }, [
        el("header", { className: "screen-topbar" }, [
          el("div", { className: "screen-title-block" }, [
            el("span", { className: "screen-kicker", text: "How to Play" }),
            el("h2", { text: "玩法說明" })
          ]),
          makeButton("返回", { on: { click: () => this.app.navigate("main-menu") } })
        ]),
        el("section", { className: "instructions-panel surface" }, [
          el("p", { className: "muted", text: "完成整張圖片即可過關。遊戲支援觸控與滑鼠操作，進度暫存在本分頁工作階段。" }),
          el("ol", { className: "instruction-steps" }, steps.map(([title, text]) => el("li", {}, [
            el("strong", { text: title }),
            el("span", { text })
          ])))
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }
}
