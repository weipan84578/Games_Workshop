(function () {
  window.EAE = window.EAE || {};

  class HelpUI {
    constructor(options) {
      this.screenManager = options.screenManager;
      this.boardData = options.boardData;
      this.sfx = options.sfx;
      this.miniRenderer = null;
    }

    init() {
      document.getElementById("btn-help-back").addEventListener("click", () => {
        if (this.sfx) this.sfx.playClick();
        this.screenManager.show("home");
      });
      this.renderMiniBoard();
    }

    renderMiniBoard() {
      const container = document.getElementById("help-board-mini");
      if (!container) return;
      this.miniRenderer = new window.EAE.BoardRenderer(container, this.boardData, { showPieces: false });
      this.miniRenderer.render();
    }
  }

  window.EAE.HelpUI = HelpUI;
})();
