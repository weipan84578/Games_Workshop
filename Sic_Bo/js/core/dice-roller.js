(function () {
  window.SicBo = window.SicBo || {};

  function randomDie() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return (array[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDice() {
    return [randomDie(), randomDie(), randomDie()];
  }

  window.SicBo.DiceRoller = {
    rollDice: rollDice
  };
})();
