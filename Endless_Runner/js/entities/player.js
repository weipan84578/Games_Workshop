(function(ER) {
    var Player = {
        x: 0, y: 0, vy: 0,
        width: 64, height: 64,
        state: 'run',  // run|jump|fall|hurt|dead
        isInvincible: false,
        invincibleTimer: 0,
        doubleJumpUsed: false,
        spriteFrame: 0,
        frameTimer: 0,
        _runFrameInterval: 1000/12,
        _jumpFrameInterval: 1000/10,
        _deadFrameCount: 6,
        _deadFrame: 0,
        _deadDone: false,
        _groundY: 0,
        _onGround: false,
        _prevOnGround: false,

        reset: function(canvasW, groundY) {
            this.x = Math.floor(canvasW / 5);
            this._groundY = groundY;
            this.y = groundY - this.height;
            this.vy = 0;
            this.state = 'run';
            this.isInvincible = false;
            this.invincibleTimer = 0;
            this.doubleJumpUsed = false;
            this.spriteFrame = 0;
            this.frameTimer = 0;
            this._deadFrame = 0;
            this._deadDone = false;
            this._onGround = true;
            this._prevOnGround = true;
        },

        jump: function() {
            if (this.state === 'dead') return;
            if (this._onGround) {
                this.vy = ER.Physics.JUMP_FORCE;
                this.state = 'jump';
                this._onGround = false;
                this.doubleJumpUsed = false;
                ER.Particles.emit('jump_dust', this.x + this.width/2, this._groundY, ER.Game.state.quality);
                ER.Audio.playSFX('jump');
            } else if (!this.doubleJumpUsed) {
                this.vy = ER.Physics.DOUBLE_JUMP_FORCE;
                this.doubleJumpUsed = true;
                ER.Audio.playSFX('doubleJump');
            }
        },

        hit: function() {
            if (this.isInvincible || this.state === 'dead') return false;
            this.isInvincible = true;
            this.invincibleTimer = 2000;
            this.state = 'hurt';
            ER.Particles.emit('hit', this.x + this.width/2, this.y + this.height/2, ER.Game.state.quality);
            ER.Audio.playSFX('hit');
            return true;
        },

        die: function() {
            this.state = 'dead';
            this._deadFrame = 0;
            this._deadDone = false;
            ER.Particles.emit('death', this.x + this.width/2, this.y + this.height/2, ER.Game.state.quality);
            ER.Audio.playSFX('die');
        },

        update: function(dt) {
            if (this.state === 'dead') {
                this.frameTimer += dt;
                if (this.frameTimer >= 1000/8) {
                    this.frameTimer = 0;
                    if (this._deadFrame < this._deadFrameCount - 1) this._deadFrame++;
                    else this._deadDone = true;
                }
                this.vy = Math.min(this.vy + ER.Physics.GRAVITY * (dt/16.67), ER.Physics.MAX_FALL_SPEED);
                this.y += this.vy * (dt/16.67);
                if (this.y + this.height >= this._groundY) { this.y = this._groundY - this.height; this.vy = 0; }
                return;
            }

            // Physics
            this._prevOnGround = this._onGround;
            this.vy = Math.min(this.vy + ER.Physics.GRAVITY * (dt/16.67), ER.Physics.MAX_FALL_SPEED);
            this.y += this.vy * (dt/16.67);

            if (this.y + this.height >= this._groundY) {
                this.y = this._groundY - this.height;
                var wasInAir = !this._prevOnGround;
                this._onGround = true;
                this.vy = 0;
                this.doubleJumpUsed = false;
                if (wasInAir && this.state !== 'hurt') {
                    ER.Particles.emit('land', this.x + this.width/2, this._groundY, ER.Game.state.quality);
                    ER.Audio.playSFX('land');
                }
            } else {
                this._onGround = false;
            }

            // State
            if (this.state !== 'hurt') {
                if (this._onGround) this.state = 'run';
                else if (this.vy < 0) this.state = 'jump';
                else this.state = 'fall';
            }

            // Invincible countdown
            if (this.isInvincible) {
                this.invincibleTimer -= dt;
                if (this.invincibleTimer <= 0) {
                    this.isInvincible = false;
                    if (this.state === 'hurt') this.state = this._onGround ? 'run' : 'fall';
                }
            }

            // Animation
            var interval = this._onGround ? this._runFrameInterval : this._jumpFrameInterval;
            this.frameTimer += dt;
            if (this.frameTimer >= interval) {
                this.frameTimer = 0;
                this.spriteFrame = (this.spriteFrame + 1) % 8;
            }

            // Run dust
            if (this._onGround && Math.random() < 0.3) {
                ER.Particles.emit('run_dust', this.x + 10, this._groundY, ER.Game.state.quality);
            }
        },

        draw: function(ctx) {
            if (!this.isInvincible || Math.floor(Date.now() / 80) % 2 === 0) {
                this._drawPlayer(ctx);
            }
        },

        _drawPlayer: function(ctx) {
            var x = this.x, y = this.y, w = this.width, h = this.height;
            var cx = x + w/2, cy = y + h/2;
            var t = this.spriteFrame / 8;
            var legSwing = Math.sin(t * Math.PI * 2) * 14;
            var armSwing = Math.cos(t * Math.PI * 2) * 10;

            ctx.save();

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(cx, this._groundY + 3, 20, 5, 0, 0, Math.PI*2);
            ctx.fill();

            var isHurt = this.state === 'hurt';
            var isDead = this.state === 'dead';

            if (isDead) {
                // Fallen figure
                ctx.translate(cx, y + h - 12);
                ctx.rotate(Math.PI / 2 * (this._deadFrame / (this._deadFrameCount - 1)));
                ctx.fillStyle = '#1A3A6E';
                ctx.fillRect(-h/2, -10, h, 20);
                ctx.fillStyle = '#00D4FF';
                ctx.beginPath(); ctx.arc(-h/2 + 10, 0, 10, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                return;
            }

            var bodyTilt = 0;
            if (this.state === 'jump') bodyTilt = -0.15;
            if (this.state === 'fall') bodyTilt = 0.1;

            ctx.translate(cx, cy);
            ctx.rotate(bodyTilt);

            // Body (torso)
            ctx.fillStyle = isHurt ? '#FF3B3B' : '#1A3A6E';
            ctx.fillRect(-10, -14, 20, 22);
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00D4FF';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-10, -14, 20, 22);

            // Neon chest detail
            ctx.strokeStyle = isHurt ? '#ffff00' : '#00D4FF';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(6, -4); ctx.stroke();

            // Head
            ctx.fillStyle = isHurt ? '#FF3B3B' : '#2A5A9E';
            ctx.beginPath(); ctx.arc(0, -22, 11, 0, Math.PI*2); ctx.fill();

            // Visor
            var visorGrd = ctx.createLinearGradient(-8, -26, 8, -18);
            visorGrd.addColorStop(0, isHurt ? '#ff6600' : '#00D4FF');
            visorGrd.addColorStop(1, isHurt ? '#ff000088' : '#0066FF88');
            ctx.fillStyle = visorGrd;
            ctx.beginPath();
            ctx.moveTo(-8, -26); ctx.lineTo(8, -26);
            ctx.lineTo(9, -19); ctx.lineTo(-9, -19);
            ctx.closePath(); ctx.fill();
            ctx.shadowColor = isHurt ? '#FF6600' : '#00D4FF';
            ctx.shadowBlur = 6;
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00FFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Left arm
            var la = this.state === 'jump' ? -20 : armSwing;
            ctx.fillStyle = isHurt ? '#CC2222' : '#152E5A';
            ctx.save();
            ctx.translate(-14, -8);
            ctx.rotate((la * Math.PI) / 180);
            ctx.fillRect(-4, 0, 8, 18);
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00D4FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(-4, 0, 8, 18);
            ctx.restore();

            // Right arm
            var ra = this.state === 'jump' ? -20 : -armSwing;
            ctx.save();
            ctx.translate(14, -8);
            ctx.rotate((ra * Math.PI) / 180);
            ctx.fillStyle = isHurt ? '#CC2222' : '#152E5A';
            ctx.fillRect(-4, 0, 8, 18);
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00D4FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(-4, 0, 8, 18);
            ctx.restore();

            // Left leg
            var ll = this.state === 'jump' ? -25 : legSwing;
            ctx.fillStyle = isHurt ? '#992222' : '#0F2040';
            ctx.save();
            ctx.translate(-8, 8);
            ctx.rotate((ll * Math.PI) / 180);
            ctx.fillRect(-5, 0, 10, 22);
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00D4FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(-5, 0, 10, 22);
            // Boot
            ctx.fillStyle = isHurt ? '#AA3333' : '#1A1A3E';
            ctx.fillRect(-5, 18, 12, 6);
            ctx.restore();

            // Right leg
            var rl = this.state === 'jump' ? -25 : -legSwing;
            ctx.save();
            ctx.translate(8, 8);
            ctx.rotate((rl * Math.PI) / 180);
            ctx.fillStyle = isHurt ? '#992222' : '#0F2040';
            ctx.fillRect(-5, 0, 10, 22);
            ctx.strokeStyle = isHurt ? '#FF9900' : '#00D4FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(-5, 0, 10, 22);
            ctx.fillStyle = isHurt ? '#AA3333' : '#1A1A3E';
            ctx.fillRect(-5, 18, 12, 6);
            ctx.restore();

            // Speed lines in fast mode
            if (ER.Game.state.speed > 12) {
                ctx.globalAlpha = 0.4;
                ctx.strokeStyle = '#00D4FF';
                ctx.lineWidth = 1;
                for (var i = 0; i < 3; i++) {
                    var sy = -10 + i * 10;
                    ctx.beginPath();
                    ctx.moveTo(-30 - i*5, sy);
                    ctx.lineTo(-16, sy);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }

            ctx.restore();
        },

        getHitbox: function() {
            var sw = this.width * 0.75;
            var sh = this.height * 0.85;
            return {
                x: this.x + (this.width - sw) / 2,
                y: this.y + (this.height - sh) / 2,
                w: sw, h: sh
            };
        }
    };

    ER.Player = Player;
})(window.ER = window.ER || {});
