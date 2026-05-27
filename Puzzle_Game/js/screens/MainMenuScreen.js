import { DIFFICULTIES } from "../utils/constants.js";
import { copyCanvas, drawCanvasPreview, el, getDifficultyById, makeButton } from "../utils/helpers.js";
import { Modal } from "../ui/Modal.js";
import { enterScreen } from "../ui/Transitions.js";

export class MainMenuScreen {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.previewCanvas = null;
  }

  render() {
    this.previewCanvas = el("canvas", { attrs: { width: 420, height: 420 } });

    const screen = el("main", { className: "screen main-menu" }, [
      el("div", { className: "screen-shell main-menu-layout" }, [
        el("section", { className: "brand-block" }, [
          el("span", { className: "screen-kicker", text: "Puzzle Challenge" }),
          el("h1", { text: "拼圖挑戰" }),
          el("p", {
            className: "brand-subtitle",
            text: "上傳一張圖片、選擇難度，拖曳碎片完成整張拼圖。"
          }),
          el("div", { className: "menu-actions" }, [
            makeButton("開始新遊戲", {
              variant: "primary",
              on: { click: () => this.openNewGameModal() }
            }),
            makeButton("繼續遊戲", {
              disabled: !this.app.canContinue(),
              on: { click: () => this.app.continueGame() }
            }),
            el("div", { className: "toolbar" }, [
              makeButton("玩法", { on: { click: () => this.app.navigate("instructions") } }),
              makeButton("設定", { on: { click: () => this.app.navigate("settings") } })
            ])
          ])
        ]),
        el("aside", { className: "preview-tile surface", attrs: { "aria-label": "拼圖預覽" } }, [
          this.previewCanvas,
          el("div", { className: "preview-caption" }, [
            el("span", { text: this.app.state.defaultDifficulty.zh }),
            el("strong", { text: `${this.app.state.defaultDifficulty.cols} × ${this.app.state.defaultDifficulty.cols}` })
          ])
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    drawCanvasPreview(this.app.getDefaultCanvas(), this.previewCanvas);
  }

  destroy() {
    if (this.modal) {
      const modal = this.modal;
      this.modal = null;
      modal.close();
    }
  }

  openNewGameModal() {
    let step = 0;
    let selectedCanvas = copyCanvas(this.app.getDefaultCanvas());
    let selectedName = "預設插畫";
    let selectedKind = "demo";
    let selectedDifficultyId = this.app.state.settings.defaultDifficulty;

    this.modal = new Modal({
      title: "建立新拼圖",
      onClose: () => {
        this.modal = null;
      }
    });

    const drawSelectedPreview = (canvas) => {
      requestAnimationFrame(() => {
        const preview = canvas.querySelector("canvas");
        if (preview) drawCanvasPreview(selectedCanvas, preview);
      });
    };

    const renderSteps = () => el("div", { className: "modal-steps", attrs: { "aria-hidden": "true" } },
      [0, 1, 2].map((index) => el("span", {
        className: `modal-step ${index <= step ? "is-active" : ""}`
      }))
    );

    const renderUploadStep = () => {
      const input = el("input", {
        type: "file",
        className: "sr-only",
        attrs: { accept: "image/jpeg,image/png,image/webp,image/gif,image/bmp" },
        on: {
          change: async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            try {
              const result = await this.app.importImageFile(file);
              selectedCanvas = result.canvas;
              selectedName = result.name;
              selectedKind = "upload";
              this.app.toast.show("圖片已載入", "success");
              render();
            } catch (error) {
              this.app.toast.show(error.message, "error");
            }
          }
        }
      });

      const chooseButton = makeButton("選擇圖片", {
        variant: "accent",
        on: { click: () => input.click() }
      });
      const defaultButton = makeButton("使用預設圖片", {
        on: {
          click: () => {
            selectedCanvas = copyCanvas(this.app.getDefaultCanvas());
            selectedName = "預設插畫";
            selectedKind = "demo";
            render();
          }
        }
      });

      const uploadZone = el("div", {
        className: "upload-zone",
        on: {
          dragover: (event) => {
            event.preventDefault();
            uploadZone.classList.add("is-dragging");
          },
          dragleave: () => uploadZone.classList.remove("is-dragging"),
          drop: async (event) => {
            event.preventDefault();
            uploadZone.classList.remove("is-dragging");
            const file = event.dataTransfer.files?.[0];
            if (!file) return;
            try {
              const result = await this.app.importImageFile(file);
              selectedCanvas = result.canvas;
              selectedName = result.name;
              selectedKind = "upload";
              this.app.toast.show("圖片已載入", "success");
              render();
            } catch (error) {
              this.app.toast.show(error.message, "error");
            }
          }
        }
      }, [
        el("div", {}, [
          el("h3", { text: "圖片來源" }),
          el("p", { className: "muted", text: "JPG、PNG、WebP、GIF、BMP，最大 10MB。" }),
          el("div", { className: "upload-actions" }, [chooseButton, defaultButton]),
          input
        ])
      ]);

      const previewWrap = el("div", { className: "stack" }, [
        uploadZone,
        el("div", { className: "image-preview" }, [
          el("canvas", { attrs: { width: 320, height: 320 } })
        ]),
        el("p", { className: "canvas-status", text: selectedName })
      ]);

      drawSelectedPreview(previewWrap);
      return previewWrap;
    };

    const renderDifficultyStep = () => el("div", { className: "stack" }, [
      el("p", { className: "muted", text: "難度越高，碎片越小，吸附距離也越精準。" }),
      el("div", { className: "difficulty-grid" }, DIFFICULTIES.map((difficulty) => {
        const button = el("button", {
          className: `difficulty-card ${difficulty.id === selectedDifficultyId ? "is-selected" : ""}`,
          type: "button",
          on: {
            click: () => {
              selectedDifficultyId = difficulty.id;
              render();
            }
          }
        }, [
          el("strong", { text: `${difficulty.zh} ${difficulty.cols}×${difficulty.cols}` }),
          el("span", { text: difficulty.note })
        ]);
        return button;
      }))
    ]);

    const renderConfirmStep = () => {
      const difficulty = getDifficultyById(DIFFICULTIES, selectedDifficultyId);
      const previewWrap = el("div", { className: "stack" }, [
        el("div", { className: "image-preview" }, [
          el("canvas", { attrs: { width: 320, height: 320 } })
        ]),
        el("div", { className: "result-grid" }, [
          el("div", { className: "result-stat" }, [el("span", { text: "圖片" }), el("strong", { text: selectedName })]),
          el("div", { className: "result-stat" }, [el("span", { text: "難度" }), el("strong", { text: difficulty.zh })]),
          el("div", { className: "result-stat" }, [el("span", { text: "碎片" }), el("strong", { text: String(difficulty.pieces) })])
        ])
      ]);
      drawSelectedPreview(previewWrap);
      return previewWrap;
    };

    const render = () => {
      this.modal.setTitle(["選擇圖片", "選擇難度", "確認開始"][step]);
      const content = el("div", { className: "stack" }, [
        renderSteps(),
        step === 0 ? renderUploadStep() : step === 1 ? renderDifficultyStep() : renderConfirmStep()
      ]);

      const backButton = makeButton("上一步", {
        disabled: step === 0,
        on: {
          click: () => {
            step -= 1;
            render();
          }
        }
      });
      const nextButton = makeButton(step === 2 ? "開始" : "下一步", {
        variant: step === 2 ? "primary" : "accent",
        on: {
          click: () => {
            if (step < 2) {
              step += 1;
              render();
              return;
            }
            const canvas = copyCanvas(selectedCanvas);
            this.modal.close();
            this.app.startGame({
              sourceCanvas: canvas,
              imageName: selectedName,
              sourceKind: selectedKind,
              difficultyId: selectedDifficultyId
            });
          }
        }
      });

      this.modal.setBody(content);
      this.modal.setFooter(backButton, nextButton);
    };

    render();
    this.modal.open();
  }
}
