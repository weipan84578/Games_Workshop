window.VP = window.VP || {};

VP.GameScreen = (function () {
  function levelName(value) {
    if (value < 30) {
      return "low";
    }
    if (value < 60) {
      return "mid";
    }
    return "high";
  }

  function renderStats(state) {
    Object.keys(state.stats).forEach(function (key) {
      var card = VP.dom.$('[data-stat="' + key + '"]');
      if (!card) {
        return;
      }
      var value = Math.round(state.stats[key]);
      card.setAttribute("data-level", levelName(value));
      VP.dom.$("strong", card).textContent = value;
      VP.dom.$(".stat-track span", card).style.width = value + "%";
    });
  }

  function renderActivity(state) {
    var log = VP.dom.$("#activity-log");
    if (!log) {
      return;
    }
    log.innerHTML = "";
    (state.activity || []).forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = VP.i18n.t(item.messageKey) + " · " + VP.TimeUtils.formatClock(item.at);
      log.appendChild(li);
    });
  }

  function render(state) {
    if (!state) {
      return;
    }
    var mood = VP.PetModel.getMoodState(state.stats, state.isSleeping);
    VP.dom.$("#pet-name").textContent = state.petName;
    VP.dom.$("#stage-label").textContent = VP.i18n.t("stages." + state.stage);
    VP.dom.$("#level-label").textContent = String(state.level);
    VP.dom.$("#age-label").textContent = VP.TimeUtils.formatDuration(Date.now() - state.bornAt);
    VP.dom.$("#xp-label").textContent = Math.round(state.exp) + "%";
    VP.dom.$("#xp-fill").style.width = VP.dom.clamp(state.exp, 0, 100) + "%";
    VP.dom.$("#last-saved").textContent = VP.i18n.t("game.lastSaved", { time: VP.TimeUtils.formatClock(state.lastSavedAt) });

    renderStats(state);
    renderActivity(state);
    VP.PetAnimation.setVisual(state.stage, mood);
    VP.PetAnimation.setSpeech("speech." + mood);

    VP.dom.$$(".action-btn").forEach(function (button) {
      button.disabled = state.stats.health <= 0;
    });

    if (state.stats.health <= 0) {
      VP.PetAnimation.setSpeech("game.gameOver");
      VP.AudioManager.playBgm("ending");
    } else if (VP.SceneManager.getCurrent() === "game-screen") {
      VP.SceneManager.syncBgm("game-screen");
    }
  }

  function init() {
    VP.dom.$$(".action-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-pet-action");
        VP.AudioManager.unlock().then(function () {
          if (!VP.GameState.performAction(action)) {
            VP.App.toast(VP.i18n.t("actionMessages.blocked"));
          }
        });
      });
    });

    VP.EventBus.on("state:changed", function (payload) {
      render(payload.state);
      if (payload.reason === "action") {
        VP.App.toast(VP.i18n.t("actionMessages." + payload.state.lastAction));
      }
    });

    VP.EventBus.on("game:saved", function (reason) {
      if (reason === "autosave") {
        VP.App.toast(VP.i18n.t("game.autosaved"));
        VP.AudioManager.playSfx("save");
      }
    });

    VP.EventBus.on("i18n:changed", function () {
      render(VP.GameState.getState());
    });
  }

  return {
    init: init,
    render: render
  };
})();
