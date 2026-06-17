window.VP = window.VP || {};

VP.SceneManager = (function () {
  var currentScene = "main-menu";
  var previousScene = "main-menu";

  function syncBgm(sceneId) {
    var state = VP.GameState.getState && VP.GameState.getState();
    if (sceneId === "main-menu" || sceneId === "egg-selection") {
      VP.AudioManager.playBgm("main-menu");
      return;
    }
    if (sceneId === "encyclopedia") {
      VP.AudioManager.playBgm("settings");
      return;
    }
    if (sceneId === "game-screen" && state) {
      if (state.stats.health <= 0) {
        VP.AudioManager.playBgm("ending");
        return;
      }
      VP.AudioManager.playBgm(state.stats.mood > 60 ? "gameplay-happy" : "gameplay-normal");
    }
  }

  function show(sceneId) {
    var scene = VP.dom.$("#" + sceneId);
    if (!scene) {
      return;
    }
    previousScene = currentScene;
    currentScene = sceneId;
    VP.dom.$$(".scene").forEach(function (item) {
      var isActive = item.id === sceneId;
      item.hidden = !isActive;
      item.classList.toggle("scene-active", isActive);
    });
    syncBgm(sceneId);
    VP.EventBus.emit("scene:changed", { current: currentScene, previous: previousScene });
  }

  function getCurrent() {
    return currentScene;
  }

  function init() {
    VP.dom.$$("[data-go-scene]").forEach(function (button) {
      button.addEventListener("click", function () {
        show(button.getAttribute("data-go-scene"));
      });
    });
  }

  return {
    init: init,
    show: show,
    getCurrent: getCurrent,
    syncBgm: syncBgm
  };
})();
