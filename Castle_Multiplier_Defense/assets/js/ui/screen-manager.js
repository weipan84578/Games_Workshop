(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var C = cg.Constants;
    var ScreenManager = cg.ScreenManager = {};
    var elementMap = { BOOT: "boot-screen", MAIN_MENU: "main-menu-screen", GAME: "game-screen", HELP: "help-screen", SETTINGS: "settings-screen", RESULT_WIN: "result-screen", RESULT_LOSE: "result-screen" };
    var confirmModal; var confirmAccept; var confirmCancel; var confirmTitle; var confirmCopy; var confirmCallback = null;
    ScreenManager.init = function () {
        confirmModal = document.getElementById("confirm-modal"); confirmAccept = document.getElementById("confirm-accept"); confirmCancel = document.getElementById("confirm-cancel"); confirmTitle = document.getElementById("confirm-title"); confirmCopy = document.getElementById("confirm-copy");
        confirmAccept.addEventListener("click", function () { var callback = confirmCallback; ScreenManager.closeConfirm(); if (callback) callback(); }); confirmCancel.addEventListener("click", ScreenManager.closeConfirm); confirmModal.addEventListener("click", function (event) { if (event.target === confirmModal) ScreenManager.closeConfirm(); });
    };
    ScreenManager.show = function (screen) {
        var actual = screen === C.SCREENS.PAUSE ? C.SCREENS.GAME : screen; var id = elementMap[actual] || elementMap.MAIN_MENU; Object.keys(elementMap).forEach(function (key) { var element = document.getElementById(elementMap[key]); if (!element || key === "RESULT_LOSE" && actual === C.SCREENS.RESULT_WIN || key === "RESULT_WIN" && actual === C.SCREENS.RESULT_LOSE) return; if (elementMap[key] !== id) { element.hidden = true; element.classList.remove("is-active"); } });
        var active = document.getElementById(id); if (active) { active.hidden = false; requestAnimationFrame(function () { active.classList.add("is-active"); }); }
        var pause = document.getElementById("pause-overlay"); if (pause) pause.hidden = screen !== C.SCREENS.PAUSE;
        root.GameState.screen = screen;
        if (cg.I18n) cg.I18n.apply(document);
        if (screen !== C.SCREENS.PAUSE && cg.Audio && screen !== C.SCREENS.BOOT) cg.Audio.startForScreen(screen);
        if (screen !== C.SCREENS.GAME && screen !== C.SCREENS.PAUSE && cg.Battle && cg.Battle.active && screen !== C.SCREENS.SETTINGS) { /* state is intentionally kept for return-from-pause */ }
        var focusScope = screen === C.SCREENS.PAUSE ? document.getElementById("pause-overlay") : active; var focusTarget = focusScope && focusScope.querySelector("button:not([disabled])"); if (focusTarget && screen !== C.SCREENS.BOOT) setTimeout(function () { focusTarget.focus(); }, 30);
    };
    ScreenManager.showConfirm = function (titleKey, copyKey, callback, acceptKey) {
        confirmCallback = callback; confirmTitle.textContent = cg.I18n.t(titleKey); confirmCopy.textContent = cg.I18n.t(copyKey); confirmAccept.querySelector("span").textContent = cg.I18n.t(acceptKey || "common.confirm"); confirmModal.hidden = false; setTimeout(function () { confirmAccept.focus(); }, 20);
    };
    ScreenManager.closeConfirm = function () { if (confirmModal) confirmModal.hidden = true; confirmCallback = null; };
    ScreenManager.showError = function () { var modal = document.getElementById("error-modal"); modal.hidden = false; var button = modal.querySelector("button"); setTimeout(function () { button.focus(); }, 20); };
    ScreenManager.closeError = function () { document.getElementById("error-modal").hidden = true; };
}(window));
