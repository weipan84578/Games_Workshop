(function () {
  const MathUtil = {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    lerp(from, to, amount) {
      return from + (to - from) * amount;
    },

    randomRange(min, max) {
      return min + Math.random() * (max - min);
    },

    randomSign() {
      return Math.random() < 0.5 ? -1 : 1;
    },

    rectCircleCollision(circle, rect) {
      const nearestX = MathUtil.clamp(circle.x, rect.x, rect.x + rect.width);
      const nearestY = MathUtil.clamp(circle.y, rect.y, rect.y + rect.height);
      const dx = circle.x - nearestX;
      const dy = circle.y - nearestY;

      return dx * dx + dy * dy <= circle.radius * circle.radius;
    },

    reflectY(y, height) {
      if (y < 0) {
        return -y;
      }
      if (y > height) {
        return height - (y - height);
      }
      return y;
    },

    predictBallY(ball, targetX, height) {
      if (Math.abs(ball.vx) < 0.01) {
        return ball.y;
      }

      const time = (targetX - ball.x) / ball.vx;
      if (time <= 0) {
        return ball.y;
      }

      let predicted = ball.y + ball.vy * time;
      const span = height * 2;
      predicted = ((predicted % span) + span) % span;

      if (predicted > height) {
        predicted = span - predicted;
      }

      return predicted;
    },

    getBounceVelocity(ball, paddle, direction, maxAngleRadians) {
      const relative = MathUtil.clamp((ball.y - paddle.centerY) / (paddle.height / 2), -1, 1);
      const angle = relative * maxAngleRadians;
      const speed = Math.min(CONSTANTS.BALL_MAX_SPEED, ball.speed + CONSTANTS.BALL_SPEED_INCREMENT);

      return {
        vx: Math.cos(angle) * speed * direction,
        vy: Math.sin(angle) * speed,
        speed,
        edge: Math.abs(relative) > 0.82
      };
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Math = MathUtil;
})();
