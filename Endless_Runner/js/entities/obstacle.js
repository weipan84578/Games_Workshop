(function(ER) {
    var TYPES = {
        OBS_LOW:  { w: 48, h: 40, color: '#8B4513', glowColor: '#FF6B35', minTime: 0 },
        OBS_MID:  { w: 48, h: 72, color: '#2D4A6E', glowColor: '#00D4FF', minTime: 30 },
        OBS_HIGH: { w: 48, h: 96, color: '#4A1A6E', glowColor: '#FF3B3B', minTime: 60 },
        OBS_FLY:  { w: 64, h: 32, color: '#1A4A2E', glowColor: '#44FF88', minTime: 60 },
        OBS_COMBO:{ w: 48, h: 40, color: '#6E1A1A', glowColor: '#FF6B35', minTime: 90 }
    };

    function Obstacle(x, groundY, type, flyHeight) {
        this.type = type;
        var info = TYPES[type];
        this.w = info.w;
        this.h = info.h;
        this.x = x;
        this.color = info.color;
        this.glowColor = info.glowColor;
        this.active = true;
        this.scored = false; // for passing-obstacle score
        this.animTimer = 0;

        if (type === 'OBS_FLY') {
            this.y = groundY - this.h - (flyHeight || ER.Math.randomBetween(60, 140));
        } else {
            this.y = groundY - this.h;
        }

        // Combo: add a companion fly obstacle
        this.companion = null;
        if (type === 'OBS_COMBO') {
            this.companion = {
                x: x + 20,
                y: groundY - 40 - ER.Math.randomBetween(80, 130),
                w: 56, h: 28,
                color: '#1A4A2E', glowColor: '#44FF88'
            };
        }
    }

    Obstacle.prototype.update = function(dt, worldSpeed) {
        if (!this.active) return;
        var dx = worldSpeed * (dt / 16.67);
        this.x -= dx;
        this.animTimer += dt;
        if (this.companion) this.companion.x -= dx;
        if (this.x + this.w < -100) this.active = false;
    };

    Obstacle.prototype.draw = function(ctx) {
        if (!this.active) return;
        this._drawOne(ctx, this.x, this.y, this.w, this.h, this.color, this.glowColor, this.type);
        if (this.companion) {
            this._drawOne(ctx, this.companion.x, this.companion.y, this.companion.w, this.companion.h, this.companion.color, this.companion.glowColor, 'OBS_FLY');
        }
    };

    Obstacle.prototype._drawOne = function(ctx, x, y, w, h, color, glowColor, type) {
        ctx.save();
        // Glow
        var grd = ctx.createRadialGradient(x+w/2, y+h/2, 0, x+w/2, y+h/2, Math.max(w,h));
        grd.addColorStop(0, glowColor + '44');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(x - 10, y - 10, w + 20, h + 20);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);

        // Neon border
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 2;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
        ctx.shadowBlur = 0;

        if (type === 'OBS_LOW') {
            // Barrel bands
            ctx.strokeStyle = glowColor + 'aa';
            ctx.lineWidth = 2;
            for (var i = 1; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y + h * i / 3);
                ctx.lineTo(x + w, y + h * i / 3);
                ctx.stroke();
            }
            // Round top
            ctx.fillStyle = glowColor + '55';
            ctx.beginPath();
            ctx.ellipse(x + w/2, y + 4, w/2 - 2, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'OBS_HIGH') {
            // Spikes on top
            ctx.fillStyle = glowColor;
            var spikes = 3;
            var sw = w / spikes;
            for (var i = 0; i < spikes; i++) {
                ctx.beginPath();
                ctx.moveTo(x + i*sw, y);
                ctx.lineTo(x + i*sw + sw/2, y - 14);
                ctx.lineTo(x + (i+1)*sw, y);
                ctx.fill();
            }
        } else if (type === 'OBS_FLY' || type === 'OBS_COMBO') {
            // Wings animation
            var wingFlap = Math.sin(this.animTimer * 0.015) * 8;
            ctx.fillStyle = glowColor + 'cc';
            // Left wing
            ctx.beginPath();
            ctx.moveTo(x, y + h/2);
            ctx.lineTo(x - 14, y + h/2 - wingFlap);
            ctx.lineTo(x + w/3, y + h/2);
            ctx.fill();
            // Right wing
            ctx.beginPath();
            ctx.moveTo(x + w, y + h/2);
            ctx.lineTo(x + w + 14, y + h/2 - wingFlap);
            ctx.lineTo(x + w*2/3, y + h/2);
            ctx.fill();
            // Eye
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(x + w*0.7, y + h*0.35, 4, 0, Math.PI*2);
            ctx.fill();
        } else if (type === 'OBS_MID') {
            // Fence bars
            ctx.strokeStyle = glowColor + 'cc';
            ctx.lineWidth = 3;
            var bars = 3;
            var bw = w / (bars + 1);
            for (var i = 1; i <= bars; i++) {
                ctx.beginPath();
                ctx.moveTo(x + i*bw, y);
                ctx.lineTo(x + i*bw, y + h);
                ctx.stroke();
            }
        }
        ctx.restore();
    };

    Obstacle.prototype.getHitbox = function() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    };

    Obstacle.prototype.getCompanionHitbox = function() {
        if (!this.companion) return null;
        return { x: this.companion.x, y: this.companion.y, w: this.companion.w, h: this.companion.h };
    };

    // Pool
    var pool = [];

    function getObs(x, groundY, type, flyHeight) {
        for (var i = 0; i < pool.length; i++) {
            if (!pool[i].active) {
                var o = pool[i];
                o.type = type;
                var info = TYPES[type];
                o.w = info.w; o.h = info.h;
                o.x = x; o.color = info.color; o.glowColor = info.glowColor;
                o.active = true; o.scored = false; o.animTimer = 0;
                if (type === 'OBS_FLY') {
                    o.y = groundY - o.h - (flyHeight || ER.Math.randomBetween(60, 140));
                } else {
                    o.y = groundY - o.h;
                }
                o.companion = null;
                if (type === 'OBS_COMBO') {
                    o.companion = {
                        x: x + 20, y: groundY - 40 - ER.Math.randomBetween(80,130),
                        w: 56, h: 28, color: '#1A4A2E', glowColor: '#44FF88'
                    };
                }
                return o;
            }
        }
        var o = new Obstacle(x, groundY, type, flyHeight);
        pool.push(o); return o;
    }

    ER.ObstacleManager = {
        obstacles: pool,
        _lastX: 0,
        _groundY: 0,

        reset: function(canvasWidth, groundY) {
            for (var i = 0; i < pool.length; i++) pool[i].active = false;
            this._lastX = canvasWidth + 400;
            this._groundY = groundY;
        },

        _getWeights: function(gameTime) {
            var items = [{ type: 'OBS_LOW', weight: 40 }];
            if (gameTime >= 30) items.push({ type: 'OBS_MID', weight: 30 });
            if (gameTime >= 60) items.push({ type: 'OBS_HIGH', weight: 15 }, { type: 'OBS_FLY', weight: 20 });
            if (gameTime >= 90) items.push({ type: 'OBS_COMBO', weight: 15 });
            return items;
        },

        _getGapRange: function(gameTime) {
            if (gameTime < 30)   return [600, 900];
            if (gameTime < 60)   return [450, 700];
            if (gameTime < 120)  return [350, 550];
            if (gameTime < 180)  return [280, 450];
            return [220, 380];
        },

        update: function(dt, worldSpeed, canvasWidth, groundY, gameTime) {
            this._groundY = groundY;
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].update(dt, worldSpeed);
            }
            this._lastX -= worldSpeed * (dt / 16.67);
            if (this._lastX < canvasWidth + 80) {
                var range = this._getGapRange(gameTime);
                var gap = ER.Math.randomBetween(range[0], range[1]);
                var type = ER.Math.weightedRandom(this._getWeights(gameTime));
                var newObs = getObs(canvasWidth + 80, groundY, type);
                // Remove any pre-existing coins that fall inside this obstacle's zone.
                // Left buffer = 20px (visual overlap), right buffer = 80px (landing clearance).
                if (ER.CoinManager) {
                    ER.CoinManager.clearNear(
                        canvasWidth + 80 - 20,
                        canvasWidth + 80 + newObs.w + 80
                    );
                }
                this._lastX = canvasWidth + 80 + gap;
            }
        },

        draw: function(ctx) {
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].draw(ctx);
            }
        },

        checkCollision: function(playerHitbox) {
            for (var i = 0; i < pool.length; i++) {
                var o = pool[i];
                if (!o.active) continue;
                if (ER.Physics.aabb(playerHitbox, o.getHitbox())) return o;
                var ch = o.getCompanionHitbox();
                if (ch && ER.Physics.aabb(playerHitbox, ch)) return o;
            }
            return null;
        },

        checkPassed: function(playerX) {
            var count = 0;
            for (var i = 0; i < pool.length; i++) {
                var o = pool[i];
                if (o.active && !o.scored && o.x + o.w < playerX) {
                    o.scored = true;
                    count++;
                }
            }
            return count;
        }
    };
})(window.ER = window.ER || {});
