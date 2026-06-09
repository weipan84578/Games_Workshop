(function () {
  const Canvas = {
    init(wrapper) {
      const state = Pong.GameState;
      wrapper.innerHTML = '<canvas class="game-canvas" aria-label="Pong 遊戲畫布"></canvas>';
      state.canvas.wrapper = wrapper;
      state.canvas.element = wrapper.querySelector("canvas");
      state.canvas.context = state.canvas.element.getContext("2d");

      Canvas.resize();
      Pong.Input.attachCanvas(state.canvas.element);
      return state.canvas.element;
    },

    resize() {
      const state = Pong.GameState;
      if (!state.canvas.element) {
        return;
      }

      const maxW = window.innerWidth;
      const maxH = window.innerHeight;
      let width;
      let height;

      if (maxW / maxH > CONSTANTS.GAME_RATIO) {
        height = maxH * 0.95;
        width = height * CONSTANTS.GAME_RATIO;
      } else {
        width = maxW * 0.98;
        height = width / CONSTANTS.GAME_RATIO;
      }

      const ratio = Math.max(1, window.devicePixelRatio || 1);
      state.canvas.element.width = Math.round(width * ratio);
      state.canvas.element.height = Math.round(height * ratio);
      state.canvas.element.style.width = `${Math.round(width)}px`;
      state.canvas.element.style.height = `${Math.round(height)}px`;
      state.canvas.context.setTransform(ratio, 0, 0, ratio, 0, 0);

      state.dimensions.width = width;
      state.dimensions.height = height;
      state.dimensions.scaleFactor = width / CONSTANTS.REFERENCE_WIDTH;

      if (state.game.player) {
        state.game.player.resize();
      }
      if (state.game.ai) {
        state.game.ai.resize();
      }
      if (state.game.ball) {
        state.game.ball.resize();
      }
    },

    colors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        bg: styles.getPropertyValue("--color-bg").trim() || "#0A0A1A",
        primary: styles.getPropertyValue("--color-primary").trim() || "#00FFAA",
        secondary: styles.getPropertyValue("--color-secondary").trim() || "#FF00FF",
        ball: styles.getPropertyValue("--color-ball").trim() || "#00FFAA",
        player: styles.getPropertyValue("--color-paddle-player").trim() || "#00FFAA",
        ai: styles.getPropertyValue("--color-paddle-ai").trim() || "#FF00FF",
        center: styles.getPropertyValue("--color-center-line").trim() || "rgba(255,255,255,0.2)",
        text: styles.getPropertyValue("--color-text").trim() || "#FFFFFF"
      };
    },

    clear() {
      const state = Pong.GameState;
      const ctx = state.canvas.context;
      const colors = Canvas.colors();

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, state.dimensions.width, state.dimensions.height);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, state.dimensions.width, state.dimensions.height);
    },

    drawField() {
      const state = Pong.GameState;
      const ctx = state.canvas.context;
      const { width, height } = state.dimensions;
      const colors = Canvas.colors();
      const dash = Math.max(12, height * 0.035);
      const gap = dash * 0.8;

      ctx.save();
      ctx.strokeStyle = colors.center;
      ctx.lineWidth = Math.max(2, width * 0.004);
      ctx.setLineDash([dash, gap]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = colors.center;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
      ctx.restore();
    }
  };

  window.addEventListener("resize", Canvas.resize);

  window.Pong = window.Pong || {};
  window.Pong.Canvas = Canvas;
})();
