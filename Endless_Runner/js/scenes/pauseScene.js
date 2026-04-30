(function(ER) {
    var _enterTime = 0;
    var _btnResume, _btnRestart, _btnMenu;

    ER.PauseScene = {
        enter: function() {
            _enterTime = Date.now();
            this.layout(ER.Renderer.canvas.width, ER.Renderer.canvas.height);
        },

        layout: function(cw, ch) {
            var mx = cw/2, my = ch/2;
            _btnResume  = new ER.UI.Button(mx - 150, my - 60,  300, 56, '▶ RESUME',  { bg: '#FF6B35', border: '#FF6B35', textColor:'#FFF', fontSize: 13 });
            _btnRestart = new ER.UI.Button(mx - 150, my + 10,  300, 56, '↺ RESTART', { bg:'rgba(30,30,80,0.9)', border:'#4A4A8A', textColor:'#CCC', fontSize: 13 });
            _btnMenu    = new ER.UI.Button(mx - 150, my + 80,  300, 56, '⌂ MENU',    { bg:'rgba(30,30,80,0.9)', border:'#4A4A8A', textColor:'#CCC', fontSize: 13 });
        },

        update: function(dt) {
            if (ER.Input.pauseJustPressed) {
                ER.Input.pauseJustPressed = false;
                ER.Game.resumeGame();
                return;
            }
            var click = ER.Input.clickPos;
            if (!click) return;
            if (_btnResume.isHit(click.x, click.y)) {
                ER.Audio.playSFX('btnClick');
                ER.Input.clearClick();
                ER.Game.resumeGame();
            } else if (_btnRestart.isHit(click.x, click.y)) {
                ER.Audio.playSFX('btnClick');
                ER.Input.clearClick();
                ER.Game.startGame();
            } else if (_btnMenu.isHit(click.x, click.y)) {
                ER.Audio.playSFX('btnClick');
                ER.Input.clearClick();
                ER.Game.gotoScene('main');
            } else {
                ER.Input.clearClick();
            }
        },

        draw: function(ctx) {
            var cw = ER.Renderer.LOGICAL_WIDTH, ch = ER.Renderer.LOGICAL_HEIGHT;
            var now = Date.now();
            var elapsed = now - _enterTime;
            var scale = ER.Math.easeOut(Math.min(1, elapsed / 250));

            // Draw game snapshot (already on canvas from game scene) + blur overlay
            ctx.fillStyle = 'rgba(5,5,20,0.65)';
            ctx.fillRect(0, 0, cw, ch);

            // Modal with scale animation
            var mx = cw/2, my = ch/2;
            var mw = 400, mh = 360;
            
            ctx.save();
            ctx.translate(mx, my);
            ctx.scale(scale, scale);
            ctx.translate(-mx, -my);

            ER.UI.drawModal(ctx, mx - mw/2, my - mh/2, mw, mh);

            // Title
            ER.UI.drawText(ctx, '⏸ PAUSED', mx, my - 130, { size: 24, color: '#F0F0FF', glow: '#00D4FF' });

            _btnResume.draw(ctx);
            _btnRestart.draw(ctx);
            _btnMenu.draw(ctx);

            ctx.restore();
        }
    };
})(window.ER = window.ER || {});
