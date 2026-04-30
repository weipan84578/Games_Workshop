(function(ER) {
    var _countdown = 0;
    var _countdownTimer = 0;
    var _countdownDone = false;
    var _scoreAccum = 0; // accumulator for per-second scoring
    var _comboCount = 0;
    var _lastPassedCount = 0;
    var _prevGameTime = 0;
    var _bgmFast = false;

    ER.GameScene = {
        enter: function() {
            var cw = ER.Renderer.canvas.width;
            var ch = ER.Renderer.canvas.height;
            var groundY = ER.Renderer.getGroundY();

            // Reset game state
            var gs = ER.Game.state;
            gs.score = 0;
            gs.lives = 3;
            gs.gameTime = 0;
            gs.isRunning = true;
            gs.isPaused = false;
            gs.comboCount = 0;

            // Apply speed preset from settings
            var data = ER.Storage.load();
            var presetKey = (data.settings && data.settings.speedPreset) || 'normal';
            var speedCfg = ER.Physics.SPEED_PRESET[presetKey] || ER.Physics.SPEED_PRESET.normal;
            gs.speed = speedCfg.initial;
            gs._maxSpeed = speedCfg.max;
            gs._speedIncrement = speedCfg.increment;
            gs.quality = (data.settings && data.settings.quality) || 'high';

            _countdown = 4; // 4→3→2→1→GO (starts at 4, displays 3 immediately)
            _countdownTimer = 0;
            _countdownDone = false;
            _scoreAccum = 0;
            _comboCount = 0;
            _lastPassedCount = 0;
            _prevGameTime = 0;
            _bgmFast = false;

            ER.Player.reset(cw, groundY);
            ER.ObstacleManager.reset(cw, groundY);
            ER.CoinManager.reset(cw, groundY);
            ER.Particles.clear();
            ER.UI.clearFloatTexts();

            ER.Audio.playBGM('game');
        },

        update: function(dt) {
            var gs = ER.Game.state;
            var cw = ER.Renderer.canvas.width;
            var ch = ER.Renderer.canvas.height;
            var groundY = ER.Renderer.getGroundY();

            // Check pause
            if (ER.Input.pauseJustPressed) {
                ER.Input.pauseJustPressed = false;
                ER.Game.pauseGame();
                return;
            }

            // Countdown (4→3→2→1→GO)
            if (!_countdownDone) {
                _countdownTimer += dt;
                if (_countdownTimer >= 1000) {
                    _countdownTimer -= 1000;
                    _countdown--;
                    if (_countdown > 1) {
                        ER.Audio.playSFX('countdown');
                    } else if (_countdown === 1) {
                        ER.Audio.playSFX('countdown');
                    } else {
                        _countdownDone = true;
                    }
                }
                ER.Renderer.update(dt, 0);
                ER.Player.update(dt);
                return;
            }

            // Check pause button click
            var click = ER.Input.clickPos;
            if (click) {
                var pb = ER.HUD.getPauseButtonHitbox(cw);
                if (ER.Physics.aabb({x:click.x,y:click.y,w:1,h:1}, pb)) {
                    ER.Audio.playSFX('btnClick');
                    ER.Input.clearClick();
                    ER.Game.pauseGame();
                    return;
                }
            }

            // Jump
            if (ER.Input.jumpJustPressed) {
                ER.Input.consumeJump();
                ER.Player.jump();
            }

            // Speed increase (uses per-game preset)
            gs.speed = Math.min(
                gs.speed + gs._speedIncrement * (dt / 16.67),
                gs._maxSpeed
            );

            // World scroll
            ER.Renderer.update(dt, gs.speed);

            // Entities update
            ER.Player.update(dt);
            ER.ObstacleManager.update(dt, gs.speed, cw, groundY, gs.gameTime);
            ER.CoinManager.update(dt, gs.speed, cw, groundY);
            ER.Particles.update(dt);
            ER.UI.updateFloatTexts(dt);

            // Game time (only when running)
            if (ER.Player.state !== 'dead') {
                gs.gameTime += dt / 1000;
            }

            // Per-second survival score (only when alive)
            if (ER.Player.state !== 'dead') {
                _scoreAccum += dt;
                while (_scoreAccum >= 1000) {
                    _scoreAccum -= 1000;
                    this._addScore(10, ER.Player.x, 55);
                }
            }

            // BGM switch at 120s
            if (!_bgmFast && gs.gameTime >= 120) {
                _bgmFast = true;
                ER.Audio.playBGM('fast');
                ER.Audio.playSFX('speedUp');
                ER.UI.addFloatText('SPEED UP!', cw/2, ch * 0.4, '#00D4FF');
            }

            // Collision check
            if (ER.Player.state !== 'dead' && !ER.Player.isInvincible) {
                var hit = ER.ObstacleManager.checkCollision(ER.Player.getHitbox());
                if (hit) {
                    if (ER.Player.hit()) {
                        gs.lives--;
                        _comboCount = 0;
                        gs.comboCount = 0;
                        if (gs.lives <= 0) {
                            ER.Player.die();
                        }
                    }
                }
            }

            // Coin collection and obstacle passing — skip when player is dead
            if (ER.Player.state !== 'dead') {
                var coinScore = ER.CoinManager.checkCollect(ER.Player.getHitbox());
                if (coinScore > 0) {
                    this._addScore(coinScore, ER.Player.x + 40, 60);
                }

                var passed = ER.ObstacleManager.checkPassed(ER.Player.x + ER.Player.width);
                if (passed > 0) {
                    this._addScore(25 * passed, ER.Player.x + 60, 55);
                    _comboCount += passed;
                    gs.comboCount = _comboCount;
                    if (_comboCount > 0 && _comboCount % 5 === 0) {
                        this._addScore(150, cw/2, groundY * 0.5, '#44FF88');
                        ER.Audio.playSFX('combo');
                        ER.UI.addFloatText('COMBO x' + _comboCount + '!', cw/2, groundY * 0.45, '#44FF88');
                    }
                }
            }

            // Check if dead player animation finished
            if (ER.Player.state === 'dead' && ER.Player._deadDone) {
                this._onDeath();
            }
        },

        _addScore: function(amount, x, y, color) {
            var gs = ER.Game.state;
            gs.score += amount;
            ER.UI.addFloatText('+' + amount, x, y, color || '#FFD700');
            if (gs.score > gs.bestScore) gs.bestScore = gs.score;
        },

        _onDeath: function() {
            var gs = ER.Game.state;
            if (!gs.isRunning) return; // guard against double-call
            gs.isRunning = false;
            // Save best score
            var data = ER.Storage.load();
            if (gs.score > data.bestScore) {
                data.bestScore = gs.score;
                ER.Storage.save(data);
            }
            gs.bestScore = data.bestScore;
            data.totalPlayCount = (data.totalPlayCount || 0) + 1;
            ER.Storage.save(data);

            // Delay before going to game over
            var self = this;
            setTimeout(function() {
                ER.Game.gotoScene('gameover');
            }, 1500);
        },

        draw: function(ctx) {
            var cw = ER.Renderer.canvas.width, ch = ER.Renderer.canvas.height;
            var gs = ER.Game.state;

            // Background layers
            ER.Renderer.drawBackground();

            // Ground
            ER.Renderer.drawGround(gs.worldX || 0);

            // Entities (Layer 5)
            ER.CoinManager.draw(ctx);
            ER.ObstacleManager.draw(ctx);
            ER.Player.draw(ctx);

            // Particles (Layer 6)
            ER.Particles.draw(ctx);

            // HUD (Layer 7)
            ER.HUD.draw(ctx, cw, ch, gs);

            // Countdown overlay
            if (!_countdownDone) {
                ctx.save();
                ctx.fillStyle = 'rgba(5,5,20,0.5)';
                ctx.fillRect(0, 0, cw, ch);
                var txt = _countdown > 1 ? String(_countdown - 1) : 'GO!';
                var pulse = 1 + 0.2 * Math.sin(_countdownTimer * 0.01);
                ctx.translate(cw/2, ch/2);
                ctx.scale(pulse, pulse);
                ctx.fillStyle = _countdown > 0 ? '#FF6B35' : '#44FF88';
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 30;
                ctx.font = "bold 72px 'Press Start 2P', monospace";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(txt, 0, 0);
                ctx.restore();
            }

            // Speed trail in high-speed
            if (gs.speed > 12) {
                ER.Particles.emit('speed_trail',
                    ER.Player.x + ER.Player.width/2,
                    ER.Player.y + ER.Player.height/2,
                    gs.quality);
            }

            // Track world X for ground grid
            if (!gs.worldX) gs.worldX = 0;
            gs.worldX += gs.speed;
        }
    };
})(window.ER = window.ER || {});
