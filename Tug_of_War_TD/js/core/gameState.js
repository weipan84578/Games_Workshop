(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var states = Object.freeze({
    LOADING: "loading",
    MENU: "menu",
    LEVELS: "levels",
    HOW_TO_PLAY: "howto",
    SETTINGS: "settings",
    BATTLE: "battle",
    PAUSED: "paused",
    RESULT: "result"
  });
  var current = states.LOADING;

  app.GameState = {
    STATES: states,
    get: function () {
      return current;
    },
    transition: function (next, payload) {
      if (!Object.keys(states).some(function (key) { return states[key] === next; })) {
        return false;
      }
      var previous = current;
      current = next;
      app.events.emit("state:change", { previous: previous, current: current, payload: payload });
      return true;
    }
  };
})(window);
