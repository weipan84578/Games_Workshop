(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config = BigTwo.Config || {};

  Config.THEMES = {
    realistic: { id: 'realistic', className: 'theme-realistic', colorScheme: 'dark' },
    midnight: { id: 'midnight', className: 'theme-midnight', colorScheme: 'dark' },
    sakura: { id: 'sakura', className: 'theme-sakura', colorScheme: 'light' },
    cuteParty: { id: 'cuteParty', className: 'theme-cute-party', colorScheme: 'light' }
  };
}(window));
