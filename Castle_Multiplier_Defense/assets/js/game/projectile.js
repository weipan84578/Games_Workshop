(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    function Projectile() { this.reset(); }
    Projectile.prototype.reset = function () {
        this.active = false; this.source = "player"; this.x = 0; this.y = 0; this.prevX = 0; this.prevY = 0; this.vx = 0; this.vy = 0; this.speed = 0; this.logicalCount = 1; this.damageTotal = 1; this.multiplier = 1; this.visualCount = 1; this.passedGates = Object.create(null); this.life = 0; this.trail = []; this.critical = false; this.seed = Math.random() * 100;
    };
    Projectile.prototype.launch = function (source, x, y, direction, speed, damage, count) {
        this.active = true; this.source = source; this.x = x; this.y = y; this.prevX = x; this.prevY = y; this.vx = direction.x * speed; this.vy = direction.y * speed; this.speed = speed; this.logicalCount = Math.max(1, count || 1); this.damageTotal = Math.max(1, damage || 1); this.multiplier = 1; this.visualCount = 1; this.passedGates = Object.create(null); this.life = 0; this.trail.length = 0; this.critical = false; this.seed = Math.random() * 100;
        return this;
    };
    Projectile.prototype.refreshVisualCount = function (cap) { this.visualCount = Math.min(cap, Math.max(1, 1 + Math.floor(Math.log(this.logicalCount + 1) * 3.2))); };

    function Pool() { this.items = []; this.free = []; }
    Pool.prototype.acquire = function () { var item = this.free.pop(); if (!item) { item = new Projectile(); this.items.push(item); } return item; };
    Pool.prototype.release = function (item) { item.reset(); this.free.push(item); };
    Pool.prototype.clear = function () { this.items.forEach(function (item) { item.reset(); }); this.free.length = this.items.length; for (var i = 0; i < this.items.length; i += 1) this.free[i] = this.items[this.items.length - 1 - i]; };
    Pool.prototype.activeCount = function () { return this.items.length - this.free.length; };
    cg.Projectile = { Pool: Pool, create: function () { return new Projectile(); } };
}(window));
