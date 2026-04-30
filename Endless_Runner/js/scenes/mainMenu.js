(function(ER) {
    var _enterTime = 0;
    var _demoX = 0;
    var _demoFrame = 0;
    var _demoTimer = 0;
    var _cloudX = 0;
    var _btnStart, _btnSettings;

    ER.MainMenu = {
        enter: function() {
            _enterTime = Date.now();
            _demoX = 300;
            ER.Audio.playBGM('menu');
            this.layout(ER.Renderer.canvas.width, ER.Renderer.canvas.height);
        },

        layout: function(cw, ch) {
            _btnStart = new ER.UI.Button(cw/2 - 150, ch * 0.55, 300, 64, '▶ START', {
                bg: '#FF6B35', border: '#FF6B35', textColor: '#FFF', fontSize: 13
            });
            _btnSettings = new ER.UI.Button(cw/2 - 150, ch * 0.55 + 84, 300, 56, '⚙ SETTINGS', {
                bg: 'rgba(30,30,80,0.85)', border: '#4A4A9A', textColor: '#CCC', fontSize: 12
            });
        },

        update: function(dt) {
            _demoTimer += dt;
            _cloudX += 0.8 * (dt / 16.67);
            _demoX -= 3 * (dt / 16.67);
            if (_demoX < -80) _demoX = 1280 + 80;
            if (_demoTimer >= 1000/12) { _demoTimer = 0; _demoFrame = (_demoFrame + 1) % 8; }

            var click = ER.Input.clickPos;
            if (click) {
                if (_btnStart.isHit(click.x, click.y)) {
                    ER.Audio.playSFX('btnClick');
                    ER.Input.clearClick();
                    ER.Game.startGame();
                    return;
                }
                if (_btnSettings.isHit(click.x, click.y)) {
                    ER.Audio.playSFX('btnClick');
                    ER.Input.clearClick();
                    ER.Game.gotoScene('settings');
                    return;
                }
                ER.Input.clearClick();
            }
        },

        draw: function(ctx) {
            var cw = ER.Renderer.LOGICAL_WIDTH;
            var ch = ER.Renderer.LOGICAL_HEIGHT;
            var now = Date.now();
            var elapsed = now - _enterTime;

            // Background
            ER.Renderer.drawBackground();
            ER.Renderer.drawGround(0);

            // Demo runner in background
            this._drawDemoRunner(ctx, _demoX, ER.Renderer.getGroundY(), _demoFrame);

            // Overlay gradient
            var ov = ctx.createLinearGradient(0, 0, 0, ch);
            ov.addColorStop(0, 'rgba(5,5,20,0.5)');
            ov.addColorStop(0.5, 'rgba(5,5,20,0.3)');
            ov.addColorStop(1, 'rgba(5,5,20,0.7)');
            ctx.fillStyle = ov;
            ctx.fillRect(0, 0, cw, ch);

            var titleY = ch * 0.32;
            var fade = Math.min(1, elapsed / 300);
            ctx.globalAlpha = fade;

            // Title glow box
            var pulse = 0.85 + 0.15 * Math.sin(now * 0.002);
            var titleFontSize = 48;
            ctx.save();
            ctx.globalAlpha = fade * 0.3;
            var bgW = 560, bgH = 100;
            ctx.fillStyle = '#FF6B35';
            ctx.shadowColor = '#FF6B35';
            ctx.shadowBlur = 40;
            ctx.fillRect(cw/2 - bgW/2, titleY - 10, bgW, bgH);
            ctx.restore();

            // Title text
            ctx.save();
            ctx.globalAlpha = fade;
            var slideY = titleY - Math.max(0, (1 - Math.min(1, elapsed/500)) * 60);
            ctx.fillStyle = '#FF6B35';
            ctx.shadowColor = '#FF8855';
            ctx.shadowBlur = 20 * pulse;
            ctx.font = "bold " + titleFontSize + "px 'Press Start 2P', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ENDLESS', cw/2, slideY);
            ctx.fillText('RUN', cw/2, slideY + 60);
            ctx.restore();

            // Buttons (fade in from bottom)
            var btnFade = Math.min(1, Math.max(0, (elapsed - 200) / 400));
            ctx.globalAlpha = btnFade;
            var floatOff = Math.sin(now * 0.002) * 6;
            _btnStart.y = (ch * 0.55) + floatOff;
            _btnStart.draw(ctx);
            _btnSettings.draw(ctx);

            // Best score
            var scoreFade = Math.min(1, Math.max(0, (elapsed - 400) / 300));
            ctx.globalAlpha = scoreFade;
            var data = ER.Storage.load();
            ctx.fillStyle = '#F0F0FF';
            ctx.font = "14px 'Press Start 2P', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('HI-SCORE', cw/2, ch - 60);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 6;
            ctx.font = "bold 24px 'Orbitron', monospace";
            ctx.fillText(String(data.bestScore).padStart(6, '0'), cw/2, ch - 30);
            ctx.shadowBlur = 0;

            // Version
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#AAAACC';
            ctx.font = "12px monospace";
            ctx.textAlign = 'right';
            ctx.fillText('v1.0.0', cw - 16, ch - 12);

            ctx.globalAlpha = 1;
        },

        _drawDemoRunner: function(ctx, x, groundY, frame) {
            var y = groundY - 64;
            var t = frame / 8;
            var legSwing = Math.sin(t * Math.PI * 2) * 12;
            ctx.save();
            ctx.globalAlpha = 0.35;
            var cx = x + 32, cy = y + 32;
            ctx.fillStyle = '#1A3A6E';
            ctx.fillRect(cx - 10, cy - 14, 20, 22);
            ctx.fillStyle = '#2A5A9E';
            ctx.beginPath(); ctx.arc(cx, cy - 22, 10, 0, Math.PI*2); ctx.fill();
            // Legs
            ctx.fillStyle = '#0F2040';
            ctx.save(); ctx.translate(cx - 7, cy + 8); ctx.rotate(legSwing * Math.PI/180);
            ctx.fillRect(-4, 0, 9, 20); ctx.restore();
            ctx.save(); ctx.translate(cx + 7, cy + 8); ctx.rotate(-legSwing * Math.PI/180);
            ctx.fillRect(-4, 0, 9, 20); ctx.restore();
            ctx.restore();
        }
    };
})(window.ER = window.ER || {});
