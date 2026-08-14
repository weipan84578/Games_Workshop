(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    cg.Touch = { enabled: "ontouchstart" in window || navigator.maxTouchPoints > 0 };
}(window));
