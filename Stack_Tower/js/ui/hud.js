(function (window) {
  'use strict';

  const HUD = {
    init() {
      this.score = Helpers.qs('#score-value');
      this.floor = Helpers.qs('#floor-value');
      this.scoreWrap = Helpers.qs('.hud-score');
      this.muteButton = Helpers.qs('#mute-btn');
    },

    update({ score, floors, bump = false }) {
      this.score.textContent = score;
      this.floor.textContent = floors;
      if (bump) {
        this.scoreWrap.classList.remove('is-bumped');
        void this.scoreWrap.offsetWidth;
        this.scoreWrap.classList.add('is-bumped');
      }
    },

    setMuted(muted) {
      this.muteButton.textContent = muted ? '×' : '♪';
      this.muteButton.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    },

    callout(message) {
      const el = Helpers.qs('#game-callout');
      el.textContent = message;
      el.classList.remove('is-visible');
      void el.offsetWidth;
      el.classList.add('is-visible');
    }
  };

  window.HUD = HUD;
})(window);
