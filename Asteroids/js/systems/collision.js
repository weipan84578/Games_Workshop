(function () {
  "use strict";

  Game.Collision = {
    circles: function (a, b) {
      return a.alive !== false && b.alive !== false && Game.Utils.circlesHit(a, b);
    },

    firstHit: function (entity, collection) {
      for (var i = 0; i < collection.length; i += 1) {
        if (Game.Collision.circles(entity, collection[i])) {
          return collection[i];
        }
      }
      return null;
    }
  };
}());
