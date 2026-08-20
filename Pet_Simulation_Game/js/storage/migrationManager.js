(function (PSG) {
  'use strict';
  PSG.storage.migrations = {
    run: function (data) {
      if (!data || typeof data !== 'object') throw new Error('Save is not an object');
      if (data.schemaVersion !== 1) throw new Error('Unsupported schema version');
      return data;
    }
  };
})(window.PSG);
