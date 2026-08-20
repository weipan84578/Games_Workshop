(function (PSG) {
  'use strict';
  PSG.economy.inventory = {
    count: function (save, itemId) { return save.economy.consumables[itemId] || 0; },
    consume: function (save, itemId) {
      if (!itemId) return true;
      var count = save.economy.consumables[itemId] || 0;
      if (count <= 0) return false;
      save.economy.consumables[itemId] = count - 1;
      return true;
    }
  };
})(window.PSG);
