(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var Gate = cg.Gate = {};
    Gate.create = function (levelData, orientation, difficultyBias) {
        var list = levelData.gates || [];
        var portrait = orientation === "portrait";
        return list.map(function (config, index) {
            var span = list.length > 3 ? .17 : .2;
            var base = list.length === 1 ? .5 : .25 + index * (.5 / Math.max(1, list.length - 1));
            var gate = {
                id: "gate-" + levelData.number + "-" + index,
                x: portrait ? .5 : base,
                y: portrait ? base : .5,
                w: portrait ? .48 : .045,
                h: portrait ? .045 : .52,
                value: config.value,
                type: config.type,
                icon: config.icon,
                move: config.move || "still",
                speed: .75 + levelData.number * .018,
                phase: index * 1.7 + levelData.number * .2,
                special: Boolean(config.special),
                active: true,
                flash: 0,
                crossed: 0,
                portrait: portrait,
                base: base,
                difficultyBias: difficultyBias || 0
            };
            if (portrait) gate.x = cg.Utils.clamp(gate.x + gate.difficultyBias * .08, .3, .7);
            else gate.y = cg.Utils.clamp(gate.y + gate.difficultyBias * .08, .3, .7);
            return gate;
        });
    };
    Gate.update = function (gate, dt, elapsed) {
        if (!gate.active) return;
        var wave = Math.sin(elapsed * gate.speed + gate.phase);
        if (gate.move === "sway") {
            if (gate.portrait) gate.x = cg.Utils.clamp(gate.x + wave * dt * .018, .27, .73);
            else gate.y = cg.Utils.clamp(gate.y + wave * dt * .018, .27, .73);
        } else if (gate.move === "slide") {
            var slide = (wave + 1) / 2;
            if (gate.portrait) gate.x = cg.Utils.lerp(.28, .72, slide);
            else gate.y = cg.Utils.lerp(.28, .72, slide);
        }
        gate.flash = Math.max(0, gate.flash - dt);
    };
    Gate.rect = function (gate) { return { x: gate.x - gate.w / 2, y: gate.y - gate.h / 2, w: gate.w, h: gate.h }; };
    Gate.apply = function (gate, projectile) {
        var before = projectile.logicalCount;
        var factor = gate.type === "divide" ? 1 / Math.max(2, gate.value) : gate.type === "add" ? 1 : gate.value;
        if (gate.type === "divide") {
            projectile.logicalCount = Math.max(1, Math.floor(projectile.logicalCount / gate.value));
            projectile.damageTotal = Math.max(1, projectile.damageTotal / gate.value);
        } else if (gate.type === "add") {
            projectile.logicalCount += gate.value;
            projectile.damageTotal += gate.value;
        } else {
            projectile.logicalCount = Math.max(1, projectile.logicalCount * gate.value);
            projectile.damageTotal = Math.max(1, projectile.damageTotal * gate.value);
        }
        projectile.multiplier = Math.max(.1, projectile.multiplier * factor);
        gate.flash = .38;
        gate.crossed += 1;
        return { before: before, after: projectile.logicalCount, factor: factor };
    };
}(window));
