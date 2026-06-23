(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.Dice = {
    rollOne() {
      return Math.floor(Math.random() * 6) + 1;
    },

    rollTurn() {
      const first = this.rollOne();
      const second = this.rollOne();
      return first === second ? [first, first, first, first] : [first, second].sort((a, b) => b - a);
    },

    consume(dice, die) {
      const next = [...dice];
      const index = next.indexOf(die);
      if (index >= 0) next.splice(index, 1);
      return next;
    },
  };
})(window);
