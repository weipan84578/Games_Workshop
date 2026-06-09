(function () {
  class Paddle {
    constructor(side) {
      this.side = side;
      this.width = 0;
      this.height = 0;
      this.x = 0;
      this.y = 0;
      this.resize(true);
    }

    resize(center) {
      const dimensions = Pong.GameState.dimensions;
      const previousCenter = this.centerY || dimensions.height / 2;
      this.width = CONSTANTS.PADDLE_WIDTH * dimensions.scaleFactor;
      this.height = Math.max(58 * dimensions.scaleFactor, dimensions.height * CONSTANTS.PADDLE_HEIGHT_RATIO);
      this.x = this.side === "player"
        ? CONSTANTS.PADDLE_OFFSET * dimensions.scaleFactor
        : dimensions.width - (CONSTANTS.PADDLE_OFFSET * dimensions.scaleFactor) - this.width;
      this.y = center
        ? (dimensions.height - this.height) / 2
        : previousCenter - this.height / 2;
      this.clamp();
    }

    get centerY() {
      return this.y + this.height / 2;
    }

    get rect() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }

    clamp() {
      this.y = Pong.Math.clamp(this.y, 0, Pong.GameState.dimensions.height - this.height);
    }

    move(deltaY) {
      this.y += deltaY;
      this.clamp();
    }

    draw(ctx) {
      const colors = Pong.Canvas.colors();
      const color = this.side === "player" ? colors.player : colors.ai;
      const radius = Math.max(4, this.width * 0.35);

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = Math.max(10, 16 * Pong.GameState.dimensions.scaleFactor);
      drawRoundRect(ctx, this.x, this.y, this.width, this.height, radius);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawRoundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  window.Pong = window.Pong || {};
  window.Pong.Paddle = Paddle;
})();
