(function (NimGame) {
  'use strict';

  function burst(root, type) {
    var state = NimGame.StateManager.getState();
    if (state.settings.reduceMotion) {
      return;
    }
    var host = root || document.body;
    var particleCount = type === 'win' ? 22 : 10;
    for (var i = 0; i < particleCount; i += 1) {
      var particle = NimGame.dom.create('span', 'particle particle-' + type, {
        'aria-hidden': 'true'
      });
      particle.style.setProperty('--x', (Math.random() * 220 - 110).toFixed(0) + 'px');
      particle.style.setProperty('--y', (Math.random() * -180 - 40).toFixed(0) + 'px');
      particle.style.setProperty('--delay', (Math.random() * 0.12).toFixed(2) + 's');
      host.appendChild(particle);
      window.setTimeout(function (node) {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }, 900, particle);
    }
  }

  function markTaking(pileIndex, amount) {
    var pile = document.querySelector('[data-pile-index="' + pileIndex + '"]');
    if (!pile) {
      return;
    }
    pile.classList.add('is-taking');
    pile.dataset.takeAmount = amount;
    window.setTimeout(function () {
      pile.classList.remove('is-taking');
      delete pile.dataset.takeAmount;
    }, 360);
  }

  NimGame.AnimationController = {
    burst: burst,
    markTaking: markTaking
  };
}(window.NimGame = window.NimGame || {}));
