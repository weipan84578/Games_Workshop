(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.Animations = {
    delay(ms) {
      return new Promise((resolve) => global.setTimeout(resolve, ms));
    },

    flashCanvas(canvas) {
      if (!canvas) return;
      canvas.classList.remove("piece-flash");
      void canvas.offsetWidth;
      canvas.classList.add("piece-flash");
    },

    speedDelay(settings) {
      if (!settings) return 520;
      if (settings.animationSpeed === "slow") return 760;
      if (settings.animationSpeed === "fast") return 260;
      return 520;
    },
  };
})(window);
