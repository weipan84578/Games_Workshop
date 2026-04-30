(function(ER) {
    ER.Input = {
        jumpJustPressed: false,
        pauseJustPressed: false,
        clickPos: null,
        _keys: {},
        _prevJump: false,
        _prevPause: false,
        _jumpDown: false,

        init: function(canvas) {
            var self = this;
            document.addEventListener('keydown', function(e) {
                self._keys[e.code] = true;
                if (['Space','ArrowUp','ArrowDown'].indexOf(e.code) >= 0) e.preventDefault();
            });
            document.addEventListener('keyup', function(e) { self._keys[e.code] = false; });

            canvas.addEventListener('mousedown', function(e) {
                var r = canvas.getBoundingClientRect();
                self.clickPos = {
                    x: (e.clientX - r.left) * (canvas.width / r.width),
                    y: (e.clientY - r.top) * (canvas.height / r.height)
                };
                self._jumpDown = true;
            });
            canvas.addEventListener('mouseup', function() { self._jumpDown = false; });

            canvas.addEventListener('touchstart', function(e) {
                e.preventDefault();
                var r = canvas.getBoundingClientRect(), t = e.touches[0];
                self.clickPos = {
                    x: (t.clientX - r.left) * (canvas.width / r.width),
                    y: (t.clientY - r.top) * (canvas.height / r.height)
                };
                self._jumpDown = true;
            }, { passive: false });
            canvas.addEventListener('touchend', function(e) {
                e.preventDefault();
                self._jumpDown = false;
            }, { passive: false });
        },

        update: function() {
            var jump = this._jumpDown || !!(this._keys['Space'] || this._keys['ArrowUp'] || this._keys['KeyW']);
            var pause = !!(this._keys['Escape'] || this._keys['KeyP']);
            this.jumpJustPressed = jump && !this._prevJump;
            this.pauseJustPressed = pause && !this._prevPause;
            this._prevJump = jump;
            this._prevPause = pause;
        },

        clearClick: function() { this.clickPos = null; },
        consumeJump: function() { this.jumpJustPressed = false; }
    };
})(window.ER = window.ER || {});
