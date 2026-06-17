window.VP = window.VP || {};

VP.GameScreen = (function () {
  var activityRenderKey = "";

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
    var activity = state.activity || [];
    var lang = VP.i18n && VP.i18n.getLang ? VP.i18n.getLang() : "";
    var renderKey = lang + "|" + activity.map(function (item) {
      return [
        item.at,
        item.messageKey,
        JSON.stringify(item.params || {})
      ].join(":");
    }).join("|");

    if (!log) {
      return;
    }
    if (activityRenderKey === renderKey && log.getAttribute("data-render-key") === renderKey) {
      return;
    }
    log.innerHTML = "";
    activity.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = VP.i18n.t(item.messageKey, item.params || {}) + " · " + VP.TimeUtils.formatClock(item.at);
      log.appendChild(li);
    });
    log.setAttribute("data-render-key", renderKey);
    activityRenderKey = renderKey;
  }

  function renderActions(state) {
    var available = VP.PetActions.availableForStage(state.stage);
    VP.dom.$$(".action-btn").forEach(function (button) {
      var action = button.getAttribute("data-pet-action");
      var visible = available.indexOf(action) >= 0;
      button.hidden = !visible;
      button.disabled = !visible || state.stats.health <= 0 || state.isDead;
    });
  }

  function render(state) {
    if (!state) {
      return;
    }
    var mood = VP.PetModel.getMoodState(state.stats, state.isSleeping, state.isDead);
    var hiddenSpecies = VP.PetCatalog.getPet(state.speciesId);
    var species = state.isRevealed ? hiddenSpecies : null;
    VP.dom.$("#pet-name").textContent = VP.PetCatalog.getDisplayName(state);
    VP.dom.$("#stage-label").textContent = VP.i18n.t("stages." + state.stage);
    VP.dom.$("#species-label").textContent = species ? VP.i18n.t("families." + species.family) : "???";
    VP.dom.$("#level-label").textContent = String(state.level);
    VP.dom.$("#age-label").textContent = VP.TimeUtils.formatDuration(Date.now() - state.bornAt);
    VP.dom.$("#xp-label").textContent = Math.round(state.exp) + "%";
    VP.dom.$("#xp-fill").style.width = VP.dom.clamp(state.exp, 0, 100) + "%";
    VP.dom.$("#last-saved").textContent = VP.i18n.t("game.lastSaved", { time: VP.TimeUtils.formatClock(state.lastSavedAt) });

    renderStats(state);
    renderActivity(state);
    renderActions(state);
    VP.PetAnimation.setVisual(state.stage, mood, species, state.eggType, hiddenSpecies);
    VP.PetAnimation.setSpeech("speech." + mood);

    if (state.stats.health <= 0 || state.isDead) {
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
            VP.PetAnimation.setSpeech("actionMessages.blocked");
          }
        });
      });
    });

    VP.EventBus.on("state:changed", function (payload) {
      render(payload.state);
    });

    VP.EventBus.on("game:saved", function (reason) {
      if (reason === "autosave") {
        VP.AudioManager.playSfx("save");
      }
    });

    VP.EventBus.on("i18n:changed", function () {
      activityRenderKey = "";
      render(VP.GameState.getState());
    });
  }

  return {
    init: init,
    render: render
  };
})();
