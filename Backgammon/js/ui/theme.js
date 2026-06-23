(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.Theme = {
    apply(theme) {
      document.documentElement.dataset.theme = theme || "classic";
      if (BG.GameUI) BG.GameUI.render();
    },
  };
})(window);
