(function () {
  class Ball {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.radius = 0;
      this.speed = 0;
      this.resize();
      this.reset(Pong.Math.randomSign());
    }

    resize() {
      this.radius = Math.max(5, CONSTANTS.BALL_RADIUS * Pong.GameState.dimensions.scaleFactor);
    }

    speedMultiplier() {
      const settings = Pong.GameState.settings || Pong.Storage.defaults();
      return CONSTANTS.SPEED_MULTIPLIERS[settings.ballSpeed] || 1;
    }

    initialSpeed() {
      return CONSTANTS.BALL_INIT_SPEED * this.speedMultiplier() * Pong.GameState.dimensions.scaleFactor;
    }

    maxSpeed() {
      return CONSTANTS.BALL_MAX_SPEED * this.speedMultiplier() * Pong.GameState.dimensions.scaleFactor;
    }

    reset(direction) {
      const dimensions = Pong.GameState.dimensions;
      const dir = direction || Pong.Math.randomSign();
      const angle = Pong.Math.randomRange(-0.35, 0.35);

      this.resize();
      this.x = dimensions.width / 2;
      this.y = dimensions.height / 2;
      this.speed = this.initialSpeed();
      this.vx = Math.cos(angle) * this.speed * dir;
      this.vy = Math.sin(angle) * this.speed;
    }

    restore(saveState) {
      const dimensions = Pong.GameState.dimensions;
      this.resize();
      this.x = Pong.Math.clamp(Number(saveState.x) || dimensions.width / 2, this.radius, dimensions.width - this.radius);
      this.y = Pong.Math.clamp(Number(saveState.y) || dimensions.height / 2, this.radius, dimensions.height - this.radius);
      this.vx = Number(saveState.vx) || this.initialSpeed();
      this.vy = Number(saveState.vy) || 0;
      this.speed = Math.min(this.maxSpeed(), Math.hypot(this.vx, this.vy) || this.initialSpeed());
    }

    update(deltaFactor) {
      const state = Pong.GameState;
      const dimensions = state.dimensions;

      this.x += this.vx * deltaFactor;
      this.y += this.vy * deltaFactor;

      if (this.y - this.radius <= 0) {
        this.y = this.radius;
        this.vy = Math.abs(this.vy);
        Pong.Audio.playSfx("wall_bounce");
        Pong.Effects.emit(this.x, this.y, Pong.Canvas.colors().primary, 8);
      } else if (this.y + this.radius >= dimensions.height) {
        this.y = dimensions.height - this.radius;
        this.vy = -Math.abs(this.vy);
        Pong.Audio.playSfx("wall_bounce");
        Pong.Effects.emit(this.x, this.y, Pong.Canvas.colors().primary, 8);
      }

      this.handlePaddle(state.game.player, 1, "paddle_hit");
      this.handlePaddle(state.game.ai, -1, "ai_hit");

      if (this.x + this.radius < 0) {
        return "ai";
      }
      if (this.x - this.radius > dimensions.width) {
        return "player";
      }
      return null;
    }

    handlePaddle(paddle, direction, soundName) {
      const movingToward = direction > 0 ? this.vx < 0 : this.vx > 0;
      if (!movingToward) {
        return;
      }

      const circle = { x: this.x, y: this.y, radius: this.radius };
      if (!Pong.Math.rectCircleCollision(circle, paddle.rect)) {
        return;
      }

      const maxAngle = Math.PI / 4;
      const relative = Pong.Math.clamp((this.y - paddle.centerY) / (paddle.height / 2), -1, 1);
      const angle = relative * maxAngle;
      const increment = CONSTANTS.BALL_SPEED_INCREMENT * Pong.GameState.dimensions.scaleFactor * this.speedMultiplier();

      this.speed = Math.min(this.maxSpeed(), this.speed + increment);
      this.vx = Math.cos(angle) * this.speed * direction;
      this.vy = Math.sin(angle) * this.speed;
      this.x = direction > 0
        ? paddle.x + paddle.width + this.radius + 0.5
        : paddle.x - this.radius - 0.5;

      const edge = Math.abs(relative) > 0.82;
      Pong.Audio.playSfx(edge ? "paddle_edge_hit" : soundName);
      Pong.Effects.emit(this.x, this.y, direction > 0 ? Pong.Canvas.colors().player : Pong.Canvas.colors().ai, edge ? 20 : 12);
      Pong.Effects.vibrate(edge ? [18, 24, 18] : 18);

      if (Pong.GameState.game.difficulty === "hard" && this.speed > this.initialSpeed() * 1.8) {
        Pong.Audio.playSfx("hard_speed_up", 0.5);
      }
    }

    draw(ctx) {
      const colors = Pong.Canvas.colors();
      ctx.save();
      ctx.fillStyle = colors.ball;
      ctx.shadowColor = colors.ball;
      ctx.shadowBlur = Math.max(12, 18 * Pong.GameState.dimensions.scaleFactor);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.Pong = window.Pong || {};
  window.Pong.Ball = Ball;
})();
