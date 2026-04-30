(function(ER) {
    var COIN_TYPES = {
        gold:   { color: '#FFD700', score: 50,  weight: 60, glowColor: '#FFA500' },
        silver: { color: '#C0C0C0', score: 30,  weight: 25, glowColor: '#A0A0A0' },
        rare:   { color: '#FF2244', score: 200, weight: 15, glowColor: '#FF6688' }
    };

    function Coin(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type || 'gold';
        this.info = COIN_TYPES[this.type];
        this.active = true;
        this.collected = false;
        this.collectTimer = 0;
        this.animTimer = 0;
        this.radius = 12;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
    }

    Coin.prototype.update = function(dt, worldSpeed) {
        if (!this.active) return;
        this.x -= worldSpeed * (dt / 16.67);
        this.animTimer += dt;
        if (this.collected) {
            this.collectTimer += dt;
            if (this.collectTimer >= 300) this.active = false;
        }
        if (this.x + this.radius < -50) this.active = false;
    };

    Coin.prototype.draw = function(ctx) {
        if (!this.active) return;
        ctx.save();
        var scale = 1;
        if (this.collected) {
            scale = 1 - this.collectTimer / 300;
            ctx.globalAlpha = scale;
        }

        var pulse = 0.9 + 0.1 * Math.sin(this.animTimer * 0.005);
        var r = this.radius * scale * pulse;
        var cx = this.x, cy = this.y;

        // Glow
        var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
        grd.addColorStop(0, this.info.glowColor + '88');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2); ctx.fill();

        // Coin body
        ctx.fillStyle = this.info.color;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(cx - r*0.3, cy - r*0.3, r*0.4, 0, Math.PI*2); ctx.fill();

        // Symbol
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = 'bold ' + Math.floor(r * 1.0) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var sym = this.type === 'gold' ? '$' : this.type === 'silver' ? 'S' : 'R';
        ctx.fillText(sym, cx, cy + 1);

        ctx.restore();
    };

    Coin.prototype.getHitbox = function() {
        return { x: this.x - this.radius, y: this.y - this.radius, w: this.radius*2, h: this.radius*2 };
    };

    // Pool
    var pool = [];
    function getCoin(x, y, type) {
        for (var i = 0; i < pool.length; i++) {
            if (!pool[i].active) {
                var c = pool[i];
                c.x = x; c.y = y; c.type = type || 'gold';
                c.info = COIN_TYPES[c.type];
                c.active = true; c.collected = false;
                c.collectTimer = 0; c.animTimer = 0;
                c.radius = 12; c.width = 24; c.height = 24;
                return c;
            }
        }
        var c = new Coin(x, y, type); pool.push(c); return c;
    }

    function pickType() {
        return ER.Math.weightedRandom([
            { type: 'gold',   weight: 60 },
            { type: 'silver', weight: 25 },
            { type: 'rare',   weight: 15 }
        ]);
    }

    ER.CoinManager = {
        coins: pool,
        _nextSpawnX: 0,
        _groundY: 0,

        reset: function(canvasWidth, groundY) {
            for (var i = 0; i < pool.length; i++) pool[i].active = false;
            this._nextSpawnX = canvasWidth + 200;
            this._groundY = groundY;
        },

        spawnGroup: function(startX, groundY) {
            var count = ER.Math.randomInt(3, 7);
            var BUFFER = 90; // safety margin around each obstacle
            var maxGroupSpan = (count - 1) * 40 + BUFFER;

            // Find a safe X that doesn't overlap any active obstacle
            var safeX = startX;
            var changed = true;
            var iter = 0;
            while (changed && iter < 20) {
                changed = false;
                var obstacles = ER.ObstacleManager.obstacles;
                for (var i = 0; i < obstacles.length; i++) {
                    var o = obstacles[i];
                    if (!o.active) continue;
                    var oLeft  = o.x - BUFFER;
                    var oRight = o.x + o.w + BUFFER;
                    // If the entire coin group overlaps this obstacle's zone, push right
                    if (safeX < oRight && safeX + maxGroupSpan > oLeft) {
                        safeX = oRight;
                        changed = true;
                        break; // re-check from the start after moving
                    }
                }
                iter++;
            }

            var pattern = Math.random() < 0.5 ? 'arc' : 'line';
            var type = pickType();

            if (pattern === 'line') {
                for (var i = 0; i < count; i++) {
                    getCoin(safeX + i * 40, groundY - 40, type);
                }
                return safeX + (count - 1) * 40; // return group end X
            } else {
                // Arc pattern (inverted U-shape)
                for (var i = 0; i < count; i++) {
                    var t = count > 1 ? i / (count - 1) : 0;
                    getCoin(safeX + i * 36, groundY - 40 - Math.sin(t * Math.PI) * 80, type);
                }
                return safeX + (count - 1) * 36;
            }
        },

        update: function(dt, worldSpeed, canvasWidth, groundY) {
            this._groundY = groundY;
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].update(dt, worldSpeed);
            }
            // Spawn groups — gap measured from the end of the previous group
            this._nextSpawnX -= worldSpeed * (dt / 16.67);
            if (this._nextSpawnX < canvasWidth + 100) {
                var groupEnd = this.spawnGroup(canvasWidth + 100, groundY);
                this._nextSpawnX = groupEnd + ER.Math.randomBetween(250, 500);
            }
        },

        draw: function(ctx) {
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].draw(ctx);
            }
        },

        // Called by ObstacleManager when a new obstacle spawns, to remove coins
        // that would visually sit inside or immediately on top of that obstacle.
        clearNear: function(xLeft, xRight) {
            for (var i = 0; i < pool.length; i++) {
                var c = pool[i];
                if (!c.active || c.collected) continue;
                if (c.x > xLeft && c.x < xRight) c.active = false;
            }
        },

        checkCollect: function(playerHitbox) {
            var total = 0;
            for (var i = 0; i < pool.length; i++) {
                var c = pool[i];
                if (!c.active || c.collected) continue;
                var ch = c.getHitbox();
                if (ER.Physics.aabb(playerHitbox, ch)) {
                    c.collected = true;
                    total += c.info.score;
                    ER.Particles.emit('coin', c.x, c.y, ER.Game.state.quality);
                    ER.Audio.playSFX(c.type === 'rare' ? 'coinRare' : 'coin');
                }
            }
            return total;
        }
    };
})(window.ER = window.ER || {});
