/* js/utils/helpers.js */
(function() {
  window.GameHelpers = {
    // AABB Bounding Box Collision
    boxCollision: function(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    },

    // Clamp value between min and max
    clamp: function(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    // Get a random float between min and max
    randomRange: function(min, max) {
      return Math.random() * (max - min) + min;
    },

    // Get a random integer between min and max (inclusive)
    randomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Select a random element from an array
    randomChoice: function(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  };
})();
