(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var C = cg.Constants;
    var App = cg.App = {};
    var initialized = false;

    App.applyDocumentSettings = function () { var settings = root.GameState.settings; document.body.dataset.theme = settings.theme; document.body.dataset.highContrast = String(settings.highContrast); document.body.dataset.reducedMotion = String(settings.reducedMotion || cg.Utils.prefersReducedMotion()); };
    App.beginBattle = function (level, fresh) { if (fresh || !root.GameState.save) { root.GameState.save = cg.SaveManager.createNew(root.GameState.settings.difficulty); cg.SaveManager.write(root.GameState.save); } else if (root.GameState.save) { root.GameState.save.difficulty = root.GameState.settings.difficulty; cg.SaveManager.write(root.GameState.save); } cg.ScreenManager.closeConfirm(); cg.Battle.start(level); cg.ScreenManager.show(C.SCREENS.GAME); requestAnimationFrame(function () { cg.Battle.resize(); }); };
    App.leaveToMenu = function () { var battle = cg.Battle; if (battle) { battle.active = false; battle.paused = false; battle.projectiles.forEach(function (projectile) { battle.projectilePool.release(projectile); }); battle.projectiles.length = 0; battle.projectilePool.clear(); cg.Particles.reset(); } if (root.GameState.save) cg.SaveManager.write(root.GameState.save); root.GameState.battle = null; cg.ScreenManager.closeConfirm(); cg.ScreenManager.closeError(); cg.Menu.refreshContinue(); cg.ScreenManager.show(C.SCREENS.MAIN_MENU); if (cg.Audio) { cg.Audio.setPaused(false); cg.Audio.startForScreen(C.SCREENS.MAIN_MENU); } };
    App.handleAction = function (action) {
        switch (action) {
            case "start": return cg.Menu.startNew();
            case "continue": return cg.Menu.continue();
            case "help": cg.Help.render(); return cg.ScreenManager.show(C.SCREENS.HELP);
            case "settings": return cg.Settings.open(C.SCREENS.MAIN_MENU);
            case "back-menu": return cg.ScreenManager.show(C.SCREENS.MAIN_MENU);
            case "settings-back": if (cg.Settings.returnScreen === C.SCREENS.PAUSE && cg.Battle.active) return cg.ScreenManager.show(C.SCREENS.PAUSE); return cg.ScreenManager.show(C.SCREENS.MAIN_MENU);
            case "pause": return cg.Battle.pause();
            case "resume": return cg.Battle.resume();
            case "restart": return cg.ScreenManager.showConfirm("confirm.restartTitle", "confirm.restartCopy", function () { cg.Battle.restart(); cg.ScreenManager.show(C.SCREENS.GAME); });
            case "pause-settings": return cg.Settings.open(C.SCREENS.PAUSE);
            case "menu-from-pause": return cg.ScreenManager.showConfirm("confirm.menuTitle", "confirm.menuCopy", App.leaveToMenu, "confirm.leave");
            case "fire": return cg.Battle.firePlayer();
            case "skill": return cg.Battle.useSkill();
            case "next-level": return cg.Result.next();
            case "retry": return cg.Result.retry();
            case "result-menu": return App.leaveToMenu();
            case "reset-settings": return cg.Settings.restoreDefaults();
            case "reset-progress": return cg.Settings.resetProgress();
            case "error-menu": return App.leaveToMenu();
            default: return undefined;
        }
    };
    App.bind = function () {
        document.addEventListener("click", function (event) { var button = event.target.closest("[data-action]"); if (!button) return; event.preventDefault(); App.handleAction(button.getAttribute("data-action")); });
        cg.Input.on("AIM", function (delta) { if (cg.Battle.active && !cg.Battle.paused) cg.Battle.adjustAim(delta.x, delta.y); });
        cg.Input.on("AIM_ABSOLUTE", function (point) { if (cg.Battle.active && !cg.Battle.paused) cg.Battle.setAim(point.x, point.y); });
        cg.Input.on("FIRE", function () { App.handleAction("fire"); });
        cg.Input.on("SKILL", function () { App.handleAction("skill"); });
        cg.Input.on("PAUSE", function () { if (root.GameState.screen === C.SCREENS.GAME || root.GameState.screen === C.SCREENS.PAUSE) App.handleAction(root.GameState.screen === C.SCREENS.GAME ? "pause" : "resume"); });
        window.addEventListener("resize", function () { if (cg.Battle) cg.Battle.resize(); });
        document.addEventListener("visibilitychange", function () { if (document.hidden && cg.Battle && cg.Battle.active && root.GameState.screen === C.SCREENS.GAME) cg.Battle.pauseForVisibility(); });
        var unlock = function () { if (cg.Audio) { cg.Audio.ensure(); if (root.GameState.screen !== C.SCREENS.BOOT) cg.Audio.startForScreen(root.GameState.screen); } };
        document.addEventListener("pointerdown", unlock, { passive: true }); document.addEventListener("keydown", unlock, { passive: true });
    };
    App.updateDebug = function (fps, delta) { var panel = document.getElementById("debug-panel"); if (!panel) return; panel.hidden = false; panel.textContent = "FPS " + fps.toFixed(0) + " · Δ " + (delta * 1000).toFixed(1) + "ms · Projectiles " + cg.Battle.projectiles.length + " · Particles " + cg.Particles.count(); };
    App.reportError = function (error) { root.GameState.lastError = error; console.error(error); if (initialized && cg.ScreenManager) cg.ScreenManager.showError(); };
    App.init = function () {
        try {
            var settings = cg.SettingsStorage.load(); cg.State.setSettings(settings); root.GameState.save = cg.SaveManager.load(); App.applyDocumentSettings(); cg.I18n.apply(document); cg.Toast.init(); cg.ScreenManager.init(); cg.Hud.init(); cg.Menu.init(); cg.Settings.init(); cg.Help.init(); cg.Battle.init(document.getElementById("battle-canvas")); App.bind(); cg.GameLoop.start(); initialized = true; setTimeout(function () { cg.ScreenManager.show(C.SCREENS.MAIN_MENU); if (root.GameState.saveCorrupted) cg.Toast.show(cg.I18n.t("toast.saveCorrupt"), "danger"); }, 360);
        } catch (error) { App.reportError(error); }
    };
    window.addEventListener("error", function (event) { if (initialized) App.reportError(event.error || new Error(event.message)); });
    window.addEventListener("unhandledrejection", function (event) { if (initialized) App.reportError(event.reason || new Error("Unhandled rejection")); });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", App.init); else App.init();
}(window));
