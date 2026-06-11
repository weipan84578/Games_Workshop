(function () {
  "use strict";

  var listeners = [];
  var current = Game.Constants.STATES.MENU;

  Game.State = {
    get: function () {
      return current;
    },

    is: function (state) {
      return current === state;
    },

    set: function (next) {
      if (next === current) return;
      var previous = current;
      current = next;
      listeners.forEach(function (listener) {
        listener(next, previous);
      });
    },

    onChange: function (listener) {
      listeners.push(listener);
    }
  };
}());
