(function(ER) {
    function Particle() {
        this.active = false;
    }
    Particle.prototype.init = function(x, y, vx, vy, color, size, life) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.active = true;
    };
    Particle.prototype.update = function(dt) {
        if (!this.active) return;
        this.vy += 0.15 * (dt / 16.67);
        this.x += this.vx * (dt / 16.67);
        this.y += this.vy * (dt / 16.67);
        this.life -= dt;
        if (this.life <= 0) this.active = false;
    };
    Particle.prototype.draw = function(ctx) {
        if (!this.active) return;
        var alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        var s = this.size * alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, s), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    var POOL_SIZE = 400;
    var pool = [];
    for (var i = 0; i < POOL_SIZE; i++) pool.push(new Particle());

    function getParticle() {
        for (var i = 0; i < pool.length; i++) {
            if (!pool[i].active) return pool[i];
        }
        var p = new Particle(); pool.push(p); return p;
    }

    var RAINBOW = ['#FF6B35','#FFD700','#44FF88','#00D4FF','#FF3B3B','#FF69B4','#9B59B6'];

    ER.Particles = {
        pool: pool,

        emit: function(type, x, y, quality) {
            var mult = quality === 'low' ? 0.3 : quality === 'medium' ? 0.6 : 1.0;

            if (type === 'run_dust') {
                var count = Math.ceil(2 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    p.init(x + ER.Math.randomBetween(-4,4), y,
                        ER.Math.randomBetween(-1.5, 0), ER.Math.randomBetween(-1, 0),
                        '#7a6a5a', ER.Math.randomBetween(1.5, 3), 400);
                }
            } else if (type === 'jump_dust') {
                var count = Math.ceil(10 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.PI + Math.random() * Math.PI;
                    var speed = ER.Math.randomBetween(1, 4);
                    p.init(x + ER.Math.randomBetween(-8,8), y,
                        Math.cos(angle) * speed, Math.sin(angle) * speed - 1,
                        i % 2 === 0 ? '#ffffff' : '#cccccc', ER.Math.randomBetween(2, 4), 300);
                }
            } else if (type === 'land') {
                var count = Math.ceil(15 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.PI + Math.random() * Math.PI;
                    var speed = ER.Math.randomBetween(1, 5);
                    p.init(x + ER.Math.randomBetween(-10,10), y,
                        Math.cos(angle) * speed, Math.sin(angle) * speed - 0.5,
                        i % 3 === 0 ? '#aaaaaa' : '#ffffff', ER.Math.randomBetween(2, 5), 500);
                }
            } else if (type === 'coin') {
                var count = Math.ceil(8 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.random() * Math.PI * 2;
                    var speed = ER.Math.randomBetween(1, 3);
                    p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 1,
                        '#FFD700', ER.Math.randomBetween(2, 4), 600);
                }
            } else if (type === 'hit') {
                var count = Math.ceil(20 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.random() * Math.PI * 2;
                    var speed = ER.Math.randomBetween(2, 6);
                    p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 2,
                        i % 2 === 0 ? '#FF3B3B' : '#FF6B35', ER.Math.randomBetween(3, 6), 800);
                }
            } else if (type === 'death') {
                var count = Math.ceil(40 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.random() * Math.PI * 2;
                    var speed = ER.Math.randomBetween(3, 10);
                    var color = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
                    p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 3,
                        color, ER.Math.randomBetween(3, 8), 1200);
                }
            } else if (type === 'new_record') {
                var count = Math.ceil(60 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    var angle = Math.random() * Math.PI * 2;
                    var speed = ER.Math.randomBetween(2, 12);
                    var color = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
                    p.init(ER.Math.randomBetween(100, 700), ER.Math.randomBetween(100, 300),
                        Math.cos(angle) * speed * 0.5, Math.sin(angle) * speed * 0.5 - 2,
                        color, ER.Math.randomBetween(3, 7), 2000);
                }
            } else if (type === 'speed_trail') {
                var count = Math.ceil(4 * mult);
                for (var i = 0; i < count; i++) {
                    var p = getParticle();
                    p.init(x - ER.Math.randomBetween(0, 20), y + ER.Math.randomBetween(-10, 10),
                        ER.Math.randomBetween(-3, -0.5), ER.Math.randomBetween(-0.5, 0.5),
                        '#00D4FF', ER.Math.randomBetween(1.5, 3), 200);
                }
            }
        },

        update: function(dt) {
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].update(dt);
            }
        },

        draw: function(ctx) {
            for (var i = 0; i < pool.length; i++) {
                if (pool[i].active) pool[i].draw(ctx);
            }
        },

        clear: function() {
            for (var i = 0; i < pool.length; i++) pool[i].active = false;
        }
    };
})(window.ER = window.ER || {});
