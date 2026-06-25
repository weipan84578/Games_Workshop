(function () {
  window.EAE = window.EAE || {};

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  class PieceAnimator {
    constructor(renderer, sfx) {
      this.renderer = renderer;
      this.sfx = sfx;
    }

    async animateMove(actor, from, to) {
      if (to === from) return;
      const direction = to > from ? 1 : -1;
      let position = from;
      while (position !== to) {
        position += direction;
        this.renderer.moveActor(actor, position);
        this.renderer.flashPiece(actor, "is-hopping", 110);
        if (this.sfx) this.sfx.playStep();
        await wait(120);
      }
    }

    async animateTransfer(actor, from, to, type) {
      const className = type === "escalator" ? "is-escalating" : "is-sliding";
      if (this.sfx) {
        if (type === "escalator") this.sfx.playEscalator();
        else this.sfx.playEel();
      }
      this.renderer.flashPiece(actor, className, type === "escalator" ? 600 : 800);
      await wait(type === "escalator" ? 220 : 260);
      this.renderer.moveActor(actor, to);
      await wait(type === "escalator" ? 380 : 540);
    }
  }

  window.EAE.PieceAnimator = PieceAnimator;
})();
