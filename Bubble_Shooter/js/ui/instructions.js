(function (BS) {
  BS.UI.Instructions = {
    init: function () {
      document.getElementById("btn-instructions-back").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.UI.Screens.show("menu");
        BS.UI.Menu.refresh();
      });
    }
  };
})(window.BubbleShooter);
