(function () {
  "use strict";

  function confetti() {
    var colors = ["#ff596d", "#36b5ff", "#f4c95d", "#6bd7c9", "#ffffff"];
    for (var i = 0; i < 44; i += 1) {
      var piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.45 + "s";
      piece.style.animationDuration = 1.4 + Math.random() * 0.9 + "s";
      document.body.appendChild(piece);
      window.setTimeout(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 2600, piece);
    }
  }

  window.Animations = {
    confetti: confetti
  };
})();
