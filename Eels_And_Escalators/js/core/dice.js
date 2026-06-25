(function () {
  window.EAE = window.EAE || {};

  window.EAE.Dice = {
    roll: function () {
      return Math.floor(Math.random() * 6) + 1;
    },
    validRollsFrom: function (position) {
      return [1, 2, 3, 4, 5, 6].filter((roll) => position + roll <= 100);
    }
  };
})();
