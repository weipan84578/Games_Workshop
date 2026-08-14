(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    cg.Difficulty = {
        get: function (name) { return cg.Constants.DIFFICULTY_MODIFIERS[name] || cg.Constants.DIFFICULTY_MODIFIERS.normal; }
    };
}(window));
