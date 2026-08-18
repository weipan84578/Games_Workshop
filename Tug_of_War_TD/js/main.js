(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var currentScreen = null;
  var currentSession = null;
  var loop = null;
  var renderer = null;
  var saveTimer = 0;
  var confirmAction = null;

  var App = {
    init: init,
    showLevels: showLevels,
    showHowTo: showHowTo,
    showSettings: showSettings,
    startBattle: startBattle,
    pauseBattle: pauseBattle,
    summon: summon,
    upgradeIncome: upgradeIncome,
    getSession: function () { return currentSession; },
    confirm: openConfirm,
    toast: toast
  };

  function init() {
    app.i18n.init();
    app.AudioManager.init();
    app.ThemeSwitcher.init();
    app.MainMenu.init(App);
    app.SettingsScreen.init(App);
    app.HowToPlayScreen.init();
    app.BattleHUD.init(App);
    app.MobileControls.init(App);
    bindGlobalActions();
    app.events.on("battle:announce", function (payload) {
      app.BattleHUD.announce(payload.key);
    });
    app.events.on("battle:boss", function (payload) {
      app.BattleHUD.announce("battle_boss_warning", { count: payload.count });
    });
    app.events.on("i18n:change", function () {
      if (currentScreen === "levels") {
        renderLevels();
      }
      if (currentSession) {
        app.BattleHUD.update(currentSession);
      }
    });
    global.addEventListener("resize", resizeBattle);
    global.addEventListener("orientationchange", function () {
      global.setTimeout(resizeBattle, 80);
    });
    showScreen("menu");
  }

  function bindGlobalActions() {
    document.querySelectorAll('[data-action="back-main"]').forEach(function (button) {
      button.addEventListener("click", function () {
        app.AudioManager.playSfx("click");
        goMain();
      });
    });
    document.getElementById("pause-resume").addEventListener("click", resumeBattle);
    document.getElementById("pause-save-exit").addEventListener("click", saveAndExit);
    document.getElementById("pause-restart").addEventListener("click", function () {
      openConfirm("confirm_new_body", function () {
        closeModal("pause-modal");
        startBattle(currentSession.level.id);
      });
    });
    document.getElementById("confirm-no").addEventListener("click", closeConfirm);
    document.getElementById("confirm-yes").addEventListener("click", function () {
      var action = confirmAction;
      closeConfirm();
      if (action) {
        action();
      }
    });
    document.getElementById("result-next").addEventListener("click", function () {
      if (currentSession && currentSession.level.id < global.LEVELS_DATA.length) {
        startBattle(currentSession.level.id + 1);
      }
    });
    document.getElementById("result-levels").addEventListener("click", function () {
      app.AudioManager.playSfx("click");
      showLevels();
    });
    document.getElementById("result-menu").addEventListener("click", function () {
      app.AudioManager.playSfx("click");
      goMain();
    });
  }

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach(function (screen) {
      screen.classList.toggle("is-active", screen.getAttribute("data-screen") === name);
    });
    currentScreen = name;
    app.GameState.transition(name);
    if (name !== "battle") {
      document.body.classList.remove("is-playing");
    } else {
      document.body.classList.add("is-playing");
    }
  }

  function goMain() {
    closeModal("pause-modal");
    closeConfirm();
    if (loop) {
      loop.stop();
      loop = null;
    }
    currentSession = null;
    renderer = null;
    showScreen("menu");
    app.AudioManager.setScene("menu");
    app.MainMenu.update();
  }

  function showLevels() {
    closeModal("pause-modal");
    closeConfirm();
    if (loop) {
      loop.stop();
      loop = null;
    }
    renderLevels();
    showScreen("levels");
    app.AudioManager.setScene("menu");
  }

  function renderLevels() {
    app.LevelSystem.renderCards(document.getElementById("level-grid"), function (level) {
      startBattle(level.id);
    });
  }

  function showHowTo() {
    closeModal("pause-modal");
    showScreen("howto");
    app.AudioManager.setScene("menu");
  }

  function showSettings() {
    closeModal("pause-modal");
    app.SettingsScreen.refresh();
    showScreen("settings");
    app.AudioManager.setScene("menu");
  }

  function startBattle(levelId, snapshot) {
    if (loop) {
      loop.stop();
    }
    currentSession = snapshot ? app.BattleSession.fromSnapshot(snapshot) : new app.BattleSession(app.LevelSystem.getLevel(levelId));
    showScreen("battle");
    renderer = new app.Renderer(document.getElementById("battle-canvas"), document.getElementById("battle-stage"));
    app.BattleHUD.openPanel();
    app.BattleHUD.update(currentSession);
    app.AudioManager.unlock();
    app.AudioManager.setScene("battle");
    app.SaveManager.saveBattle(currentSession.snapshot());
    saveTimer = 0;
    loop = new app.GameLoop(currentSession, renderer, onBattleUpdate, onBattleFinish);
    loop.start();
  }

  function onBattleUpdate(session) {
    app.BattleHUD.update(session);
    saveTimer += session.delta || 0;
    if (saveTimer >= 5) {
      app.SaveManager.saveBattle(session.snapshot());
      saveTimer = 0;
    }
  }

  function onBattleFinish(result, session) {
    currentSession = session;
    app.SaveManager.saveBattle(null);
    if (result.outcome === "victory") {
      app.SaveManager.completeLevel(result.levelId, result.stars);
      app.AudioManager.playSfx("victory");
      app.AudioManager.setScene("victory");
    } else if (result.outcome === "defeat") {
      app.AudioManager.playSfx("defeat");
      app.AudioManager.setScene("defeat");
    } else {
      app.AudioManager.setScene("menu");
    }
    renderResult(result);
    showScreen("result");
  }

  function renderResult(result) {
    var isVictory = result.outcome === "victory";
    var isDraw = result.outcome === "draw";
    var titleKey = isVictory ? "result_victory" : isDraw ? "result_draw" : "result_defeat";
    var messageKey = isVictory ? "result_victory_message" : isDraw ? "result_draw_message" : result.reason === "boss" ? "result_boss_message" : "result_defeat_message";
    var title = document.getElementById("result-title");
    var message = document.getElementById("result-message");
    title.setAttribute("data-i18n", titleKey);
    message.setAttribute("data-i18n", messageKey);
    app.i18n.apply(document.getElementById("screen-result"));
    var stars = "";
    for (var index = 1; index <= 3; index += 1) {
      stars += index <= result.stars ? "★" : '<span class="empty-star">☆</span>';
    }
    document.getElementById("result-stars").innerHTML = stars;
    document.getElementById("result-time").textContent = "∞";
    document.getElementById("result-base-hp").textContent = Math.round(result.playerPercent) + "%";
    document.getElementById("result-defeated").textContent = String(result.kills);
    var nextButton = document.getElementById("result-next");
    nextButton.hidden = !isVictory || result.levelId >= global.LEVELS_DATA.length;
    document.getElementById("result-emblem").textContent = isVictory ? "🏆" : isDraw ? "🤝" : "🛡️";
    document.getElementById("result-confetti").style.visibility = isVictory ? "visible" : "hidden";
  }

  function pauseBattle() {
    if (!loop || !currentSession || currentSession.result) {
      return;
    }
    loop.pause();
    app.GameState.transition(app.GameState.STATES.PAUSED);
    app.BattleHUD.announce("battle_paused");
    document.getElementById("pause-modal").hidden = false;
  }

  function resumeBattle() {
    closeModal("pause-modal");
    if (loop) {
      app.GameState.transition(app.GameState.STATES.BATTLE);
      loop.resume();
    }
  }

  function saveAndExit() {
    if (currentSession) {
      app.SaveManager.saveBattle(currentSession.snapshot());
    }
    closeModal("pause-modal");
    toast("toast_saved");
    goMain();
  }

  function summon(unitId) {
    if (!currentSession || !loop || !loop.running) {
      return { ok: false };
    }
    var result = currentSession.spawnSystem.spawnPlayer(currentSession, unitId);
    if (!result.ok) {
      app.AudioManager.playSfx("click");
    }
    return result;
  }

  function upgradeIncome() {
    if (!currentSession || !loop || !loop.running) {
      return { ok: false, reason: "not-in-battle" };
    }
    var result = currentSession.resource.upgradePlayer();
    if (result.ok) {
      app.AudioManager.playSfx("upgrade");
      app.BattleHUD.update(currentSession);
      return result;
    }
    if (result.reason === "insufficient") {
      app.AudioManager.playSfx("click");
    }
    return result;
  }

  function openConfirm(bodyKey, action) {
    confirmAction = action;
    document.getElementById("confirm-body").setAttribute("data-i18n", bodyKey);
    app.i18n.apply(document.getElementById("confirm-modal"));
    document.getElementById("confirm-modal").hidden = false;
  }
  function closeConfirm() {
    document.getElementById("confirm-modal").hidden = true;
    confirmAction = null;
  }
  function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) {
      modal.hidden = true;
    }
  }
  function toast(key) {
    var element = document.getElementById("toast");
    element.textContent = app.t(key);
    element.classList.remove("is-visible");
    void element.offsetWidth;
    element.classList.add("is-visible");
    global.setTimeout(function () { element.classList.remove("is-visible"); }, 2200);
  }
  function resizeBattle() {
    if (renderer && currentScreen === "battle") {
      renderer.resize();
    }
  }

  global.addEventListener("DOMContentLoaded", init);
})(window);
