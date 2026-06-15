'use strict';

const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function loadLudo(files) {
  delete global.Ludo;
  global.window = global;

  files.forEach((file) => {
    const fullPath = path.join(ROOT, file);
    delete require.cache[require.resolve(fullPath)];
    require(fullPath);
  });

  return global.Ludo;
}

module.exports = { loadLudo };
