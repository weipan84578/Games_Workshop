(function (window) {
  'use strict';

  class Block {
    constructor(config) {
      this.x = config.x;
      this.y = config.y;
      this.width = config.width;
      this.height = config.height || 34;
      this.speed = config.speed || 3;
      this.direction = config.direction || 1;
      this.hue = config.hue || 200;
      this.floorIndex = config.floorIndex || 0;
      this.isPlaced = Boolean(config.isPlaced);
      this.kind = config.kind || 'floor';
    }

    update(deltaTime, boundsWidth) {
      const frameScale = deltaTime / 16.67;
      this.x += this.speed * this.direction * frameScale;

      const leftLimit = -this.width;
      const rightLimit = boundsWidth;
      if (this.x <= leftLimit) {
        this.x = leftLimit;
        this.direction = 1;
      }
      if (this.x >= rightLimit) {
        this.x = rightLimit;
        this.direction = -1;
      }
    }

    toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        speed: this.speed,
        direction: this.direction,
        hue: this.hue,
        floorIndex: this.floorIndex,
        isPlaced: this.isPlaced,
        kind: this.kind
      };
    }

    static from(data) {
      return new Block(data);
    }
  }

  window.Block = Block;
})(window);
