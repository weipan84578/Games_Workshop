(function (window) {
  'use strict';

  class Tower {
    constructor(blockHeight = 34) {
      this.blockHeight = blockHeight;
      this.blocks = [];
      this.cameraY = 0;
      this.targetCameraY = 0;
    }

    reset(blockHeight = this.blockHeight) {
      this.blockHeight = blockHeight;
      this.blocks = [];
      this.cameraY = 0;
      this.targetCameraY = 0;
    }

    add(block) {
      block.isPlaced = true;
      this.blocks.push(block);
      return block;
    }

    topBlock() {
      return this.blocks[this.blocks.length - 1];
    }

    updateCamera(targetY, viewportHeight) {
      this.targetCameraY = Math.max(0, targetY - viewportHeight * 0.46);
      this.cameraY = Helpers.lerp(this.cameraY, this.targetCameraY, 0.08);
    }

    scaleX(ratio) {
      this.blocks.forEach((block) => {
        block.x *= ratio;
        block.width *= ratio;
      });
    }

    toJSON() {
      return {
        blockHeight: this.blockHeight,
        cameraY: this.cameraY,
        targetCameraY: this.targetCameraY,
        blocks: this.blocks.map((block) => block.toJSON())
      };
    }

    static from(data) {
      const tower = new Tower(data.blockHeight || 34);
      tower.cameraY = data.cameraY || 0;
      tower.targetCameraY = data.targetCameraY || 0;
      tower.blocks = (data.blocks || []).map((item) => Block.from(item));
      return tower;
    }
  }

  window.Tower = Tower;
})(window);
