(function () {
  const AnimationController = {
    confetti() {
      const colors = ["#e74c3c", "#2980d8", "#22a95d", "#f3b51b", "#ffffff"];
      for (let i = 0; i < 48; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Helpers.randomInt(0, 100)}vw`;
        piece.style.background = colors[Helpers.randomInt(0, colors.length - 1)];
        piece.style.animationDelay = `${Helpers.randomInt(0, 500)}ms`;
        piece.style.transform = `rotate(${Helpers.randomInt(0, 180)}deg)`;
        document.body.appendChild(piece);
        window.setTimeout(() => piece.remove(), 1900);
      }
    },

    shake(selector) {
      const el = Helpers.qs(selector);
      if (!el) return;
      el.classList.remove("is-shaking");
      void el.offsetWidth;
      el.classList.add("is-shaking");
    },
  };

  window.AnimationController = AnimationController;
})();
