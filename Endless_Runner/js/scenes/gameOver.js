(function(ER) {
    var _enterTime = 0;
    var _displayScore = 0;
    var _finalScore = 0;
    var _bestScore = 0;
    var _isNewRecord = false;
    var _btnRestart, _btnMenu;
    var _flashTimer = 0;

    ER.GameOver = {
        enter: function(finalScore, bestScore) {
            _enterTime = Date.now();
            _finalScore = finalScore || 0;
            _bestScore = bestScore || 0;
            _displayScore = 0;
            _isNewRecord = finalScore > bestScore;
            _flashTimer = 0;

            this.layout(ER.Renderer.canvas.width, ER.Renderer.canvas.height);

            if (_isNewRecord) {
                ER.Particles.emit('new_record', ER.Renderer.canvas.width/2, ER.Renderer.canvas.height/3, ER.Game.state.quality);
                ER.Audio.playSFX('newRecord');
            }
        },

        layout: function(cw, ch) {
            var mx = cw/2, my = ch/2;
            _btnRestart = new ER.UI.Button(mx - 150, my + 100, 300, 56, '↺ PLAY AGAIN', {
                bg: '#FF6B35', border: '#FF8B55', textColor: '#FFF', fontSize: 13
            });
            _btnMenu = new ER.UI.Button(mx - 150, my + 172, 300, 50, '⌂ MAIN MENU', {
                bg: 'rgba(30,30,80,0.9)', border: '#4A4A8A', textColor: '#CCC', fontSize: 12
            });
        },

        update: function(dt) {
            var elapsed = Date.now() - _enterTime;
            // Score roll animation (1200ms)
            if (elapsed < 1200) {
                var t = elapsed / 1200;
                _displayScore = Math.floor(ER.Math.easeOut(t) * _finalScore);
            } else {
                _displayScore = _finalScore;
            }
            _flashTimer += dt;

            ER.Particles.update(dt);

            var click = ER.Input.clickPos;
            if (!click) return;
            if (_btnRestart.isHit(click.x, click.y)) {
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

            // Background
            ER.Renderer.drawBackground();
            ER.UI.drawOverlay(ctx, cw, ch, 0.65);

            // Particles
            ER.Particles.draw(ctx);

            var mx = cw/2, my = ch/2;
            var mw = 400, mh = 480;

            // GAME OVER title
            ctx.save();
            var titleScale = 1 + 0.05 * Math.sin(now * 0.003);
            ctx.translate(mx, my - 210);
            ctx.scale(titleScale, titleScale);
            ctx.translate(-mx, -(my - 210));
            ctx.fillStyle = '#FF3B3B';
            ctx.shadowColor = '#FF3B3B';
            ctx.shadowBlur = 20;
            ctx.font = "bold 36px 'Press Start 2P', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('GAME OVER', mx, my - 210);
            ctx.restore();

            // Modal
            var fade = Math.min(1, elapsed / 400);
            ctx.globalAlpha = fade;
            ER.UI.drawModal(ctx, mx - mw/2, my - 160, mw, mh);

            // Your score label
            ctx.fillStyle = '#AAAACC';
            ctx.font = "12px 'Press Start 2P', monospace";
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('YOUR SCORE', mx, my - 110);

            // Score (rolling)
            ctx.fillStyle = '#FF6B35';
            ctx.shadowColor = '#FF6B35';
            ctx.shadowBlur = 8;
            ctx.font = "bold 42px 'Orbitron', monospace";
            ctx.fillText(String(_displayScore).padStart(6,'0'), mx, my - 65);
            ctx.shadowBlur = 0;

            // Best score label
            ctx.fillStyle = '#AAAACC';
            ctx.font = "12px 'Press Start 2P', monospace";
            ctx.fillText('BEST SCORE', mx, my + 5);

            // Best
            var bestFlash = _isNewRecord && Math.floor(_flashTimer / 300) % 2 === 0;
            ctx.fillStyle = bestFlash ? '#FFFFFF' : '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = bestFlash ? 20 : 6;
            ctx.font = "bold 32px 'Orbitron', monospace";
            ctx.fillText(String(_bestScore).padStart(6,'0'), mx, my + 45);
            ctx.shadowBlur = 0;

            if (_isNewRecord) {
                ctx.fillStyle = Math.floor(_flashTimer / 200) % 2 === 0 ? '#44FF88' : '#FFD700';
                ctx.font = "bold 14px 'Press Start 2P', monospace";
                ctx.fillText('🎉 NEW RECORD!', mx, my + 82);
            }

            _btnRestart.draw(ctx);
            _btnMenu.draw(ctx);

            ctx.globalAlpha = 1;
        },
    };
})(window.ER = window.ER || {});
