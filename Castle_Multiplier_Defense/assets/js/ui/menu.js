(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Menu = cg.Menu = {};
    Menu.init = function () { Menu.refreshContinue(); };
    Menu.refreshContinue = function () { var button = document.getElementById("continue-button"); if (!button) return; var enabled = cg.SaveManager.hasValidSave(); button.disabled = !enabled; button.setAttribute("aria-disabled", String(!enabled)); };
    Menu.startNew = function () {
        if (cg.SaveManager.hasValidSave()) { cg.ScreenManager.showConfirm("confirm.newGameTitle", "confirm.newGameCopy", function () { cg.App.beginBattle(1, true); }); }
        else cg.App.beginBattle(1, true);
    };
    Menu.continue = function () { var save = root.GameState.save || cg.SaveManager.load(); if (!save) { Menu.refreshContinue(); return; } cg.App.beginBattle(Math.min(cg.Level.count, save.level || 1), false); };
}(window));
