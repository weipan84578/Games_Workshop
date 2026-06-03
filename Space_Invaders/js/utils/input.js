/* js/utils/input.js */
(function() {
  const actions = {
    left: false,
    right: false,
    fire: false,
    pause: false
  };

  // For keys that should trigger once per press (like pause)
  const pressCallbacks = {};

  window.GameInput = {
    actions: actions,

    init: function() {
      this.reset();
      
      // Bind Keyboard
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
      window.addEventListener('keyup', this.handleKeyUp.bind(this));

      // Bind Mobile Touch buttons
      this.bindTouchControls();
    },

    reset: function() {
      actions.left = false;
      actions.right = false;
      actions.fire = false;
      actions.pause = false;
    },

    onPress: function(actionName, callback) {
      pressCallbacks[actionName] = callback;
    },

    handleKeyDown: function(e) {
      // Prevent scrolling on Space or Arrow keys
      if (['Space', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          actions.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          actions.right = true;
          break;
        case ' ':
        case 'Spacebar':
          actions.fire = true;
          break;
        case 'Escape':
        case 'p':
        case 'P':
          if (!e.repeat) {
            actions.pause = true;
            if (pressCallbacks['pause']) pressCallbacks['pause']();
          }
          break;
      }
    },

    handleKeyUp: function(e) {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          actions.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          actions.right = false;
          break;
        case ' ':
        case 'Spacebar':
          actions.fire = false;
          break;
        case 'Escape':
        case 'p':
        case 'P':
          actions.pause = false;
          break;
      }
    },

    bindTouchControls: function() {
      const setup = () => {
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnFire = document.getElementById('btn-fire');
        const btnPause = document.getElementById('btn-pause-quick');

        if (btnLeft) {
          btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); actions.left = true; });
          btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); actions.left = false; });
          // Mouse fallbacks for testing in responsive mode
          btnLeft.addEventListener('mousedown', () => { actions.left = true; });
          btnLeft.addEventListener('mouseup', () => { actions.left = false; });
          btnLeft.addEventListener('mouseleave', () => { actions.left = false; });
        }

        if (btnRight) {
          btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); actions.right = true; });
          btnRight.addEventListener('touchend', (e) => { e.preventDefault(); actions.right = false; });
          btnRight.addEventListener('mousedown', () => { actions.right = true; });
          btnRight.addEventListener('mouseup', () => { actions.right = false; });
          btnRight.addEventListener('mouseleave', () => { actions.right = false; });
        }

        if (btnFire) {
          btnFire.addEventListener('touchstart', (e) => { e.preventDefault(); actions.fire = true; });
          btnFire.addEventListener('touchend', (e) => { e.preventDefault(); actions.fire = false; });
          btnFire.addEventListener('mousedown', () => { actions.fire = true; });
          btnFire.addEventListener('mouseup', () => { actions.fire = false; });
          btnFire.addEventListener('mouseleave', () => { actions.fire = false; });
        }

        if (btnPause) {
          const triggerPause = (e) => {
            e.preventDefault();
            if (pressCallbacks['pause']) pressCallbacks['pause']();
          };
          btnPause.addEventListener('touchstart', triggerPause);
          btnPause.addEventListener('click', (e) => {
            // Only trigger click if touchstart didn't run (prevent double trigger)
            if (e.pointerType !== 'touch') {
              if (pressCallbacks['pause']) pressCallbacks['pause']();
            }
          });
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
      } else {
        setup();
      }
    }
  };
})();
