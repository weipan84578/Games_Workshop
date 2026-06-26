(function (window) {
  'use strict';

  const Physics = {
    calculateCut(currentBlock, baseBlock) {
      const overlapLeft = Math.max(currentBlock.x, baseBlock.x);
      const overlapRight = Math.min(currentBlock.x + currentBlock.width, baseBlock.x + baseBlock.width);
      const overlapWidth = overlapRight - overlapLeft;

      if (overlapWidth <= 0) return { type: 'miss' };

      const isPerfect = Math.abs(currentBlock.x - baseBlock.x) < 2;
      const newWidth = isPerfect ? baseBlock.width : overlapWidth;
      const newX = isPerfect ? baseBlock.x : overlapLeft;

      return {
        type: isPerfect ? 'perfect' : 'cut',
        newX,
        newWidth,
        cutLeft: {
          x: currentBlock.x,
          width: Math.max(0, overlapLeft - currentBlock.x)
        },
        cutRight: {
          x: overlapRight,
          width: Math.max(0, currentBlock.x + currentBlock.width - overlapRight)
        }
      };
    },

    calculateScore(overlapWidth, baseWidth, isPerfect, comboCount) {
      const ratio = overlapWidth / baseWidth;
      let baseScore = 10;
      if (isPerfect) baseScore = 25;
      else if (ratio > 0.9) baseScore = 15;

      const comboMultiplier = comboCount >= 3 ? 1 + (comboCount - 2) * 0.5 : 1;
      return Math.round(baseScore * comboMultiplier);
    }
  };

  window.Physics = Physics;
})(window);
