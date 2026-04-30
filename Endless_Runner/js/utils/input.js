(function(ER) {
    ER.Input = {
        jumpJustPressed: false,
        pauseJustPressed: false,
        clickPos: null,
        pointerPos: null,   // tracks current pointer position while held down
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
                var pos = {
                    x: (e.clientX - r.left) * (canvas.width / r.width),
                    y: (e.clientY - r.top)  * (canvas.height / r.height)
                };
                self.clickPos   = pos;
                self.pointerPos = { x: pos.x, y: pos.y };
                self._jumpDown  = true;
            });
            canvas.addEventListener('mousemove', function(e) {
                if (!self._jumpDown) return;
                var r = canvas.getBoundingClientRect();
                self.pointerPos = {
                    x: (e.clientX - r.left) * (canvas.width / r.width),
                    y: (e.clientY - r.top)  * (canvas.height / r.height)
                };
            });
            canvas.addEventListener('mouseup', function() {
                self._jumpDown  = false;
                self.pointerPos = null;
            });

            canvas.addEventListener('touchstart', function(e) {
                e.preventDefault();
                var r = canvas.getBoundingClientRect(), t = e.touches[0];
                var pos = {
                    x: (t.clientX - r.left) * (canvas.width / r.width),
                    y: (t.clientY - r.top)  * (canvas.height / r.height)
                };
                self.clickPos   = pos;
                self.pointerPos = { x: pos.x, y: pos.y };
                self._jumpDown  = true;
            }, { passive: false });
            canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                var r = canvas.getBoundingClientRect(), t = e.touches[0];
                self.pointerPos = {
                    x: (t.clientX - r.left) * (canvas.width / r.width),
                    y: (t.clientY - r.top)  * (canvas.height / r.height)
                };
            }, { passive: false });
            canvas.addEventListener('touchend', function(e) {
                e.preventDefault();
                self._jumpDown  = false;
                self.pointerPos = null;
            }, { passive: false });
        },

        update: function() {
            var jump  = this._jumpDown || !!(this._keys['Space'] || this._keys['ArrowUp'] || this._keys['KeyW']);
            var pause = !!(this._keys['Escape'] || this._keys['KeyP']);
            this.jumpJustPressed  = jump  && !this._prevJump;
            this.pauseJustPressed = pause && !this._prevPause;
            this._prevJump  = jump;
            this._prevPause = pause;
        },

        clearClick:  function() { this.clickPos = null; },
        consumeJump: function() { this.jumpJustPressed = false; }
    };
})(window.ER = window.ER || {});
