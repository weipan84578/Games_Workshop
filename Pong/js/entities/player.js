(function () {
  class Player extends Pong.Paddle {
    constructor() {
      super("player");
    }

    update(deltaFactor) {
      const state = Pong.GameState;
      const input = state.input;
      const speed = CONSTANTS.PLAYER_SPEED * state.dimensions.scaleFactor * deltaFactor;

      if (input.pointerActive && input.pointerY !== null) {
        const target = input.pointerY - this.height / 2;
        this.y = Pong.Math.lerp(this.y, target, 0.34);
        this.clamp();
        return;
      }

      const up = input.up || input.virtualUp;
      const down = input.down || input.virtualDown;

      if (up && !down) {
        this.move(-speed);
      } else if (down && !up) {
        this.move(speed);
      }
    }
  }

  window.Pong = window.Pong || {};
  window.Pong.Player = Player;
})();
