(function () {
  window.EAE = window.EAE || {};

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  class DiceAnimator {
    constructor(elements) {
      this.elements = Array.from(elements || []);
    }

    async roll(result) {
      this.elements.forEach((element) => {
        element.classList.add("is-rolling");
        element.dataset.face = String(window.EAE.Dice.roll());
      });
      await wait(800);
      this.elements.forEach((element) => {
        element.classList.remove("is-rolling");
        element.dataset.face = String(result);
      });
    }
  }

  window.EAE.DiceAnimator = DiceAnimator;
})();
