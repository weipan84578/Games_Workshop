(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var C = cg.Constants;
    root.GameState = {
        screen: C.SCREENS.BOOT,
        locale: C.DEFAULT_SETTINGS.locale,
        theme: C.DEFAULT_SETTINGS.theme,
        settings: Object.assign({}, C.DEFAULT_SETTINGS),
        save: null,
        saveCorrupted: false,
        battle: null,
        returnScreen: C.SCREENS.MAIN_MENU,
        lastError: null
    };

    cg.State = {
        setScreen: function (screen) { root.GameState.screen = screen; },
        setSettings: function (settings) {
            root.GameState.settings = settings;
            root.GameState.locale = settings.locale;
            root.GameState.theme = settings.theme;
        },
        resetBattle: function () { root.GameState.battle = null; },
        hasSave: function () { return !!(root.GameState.save && root.GameState.save.level); }
    };
}(window));
