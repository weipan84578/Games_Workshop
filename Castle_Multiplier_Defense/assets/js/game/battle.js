(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var Battle = cg.Battle = {};
    var canvas; var ctx;
    var palette = {};

    function cssColor(name, fallback) { return getComputedStyle(document.body).getPropertyValue(name).trim() || fallback; }
    function refreshPalette() {
        palette = {
            skyTop: cssColor("--scene-sky-top", "#172454"), skyBottom: cssColor("--scene-sky-bottom", "#70c9e6"), hillBack: cssColor("--scene-hill-back", "#39517e"), hillFront: cssColor("--scene-hill-front", "#1c644f"), ground: cssColor("--scene-ground", "#123f3d"), sun: cssColor("--scene-sun", "#ffe5a2"), primary: cssColor("--color-primary", "#62d5ff"), secondary: cssColor("--color-secondary", "#ffcf6b"), accent: cssColor("--color-accent", "#ff7aa8"), danger: cssColor("--color-danger", "#ff7186"), success: cssColor("--color-success", "#73e6b2"), panel: "rgba(8, 19, 49, .84)"
        };
    }
    function roundedRect(context, x, y, w, h, radius) {
        var r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
        context.beginPath(); context.moveTo(x + r, y); context.arcTo(x + w, y, x + w, y + h, r); context.arcTo(x + w, y + h, x, y + h, r); context.arcTo(x, y + h, x, y, r); context.arcTo(x, y, x + w, y, r); context.closePath();
    }
    function origin(side) {
        var portrait = Battle.orientation === "portrait";
        if (portrait) return side === "player" ? { x: .5, y: .88 } : { x: .5, y: .12 };
        return side === "player" ? { x: .11, y: .5 } : { x: .89, y: .5 };
    }
    function targetFor(side) { return origin(side === "player" ? "enemy" : "player"); }
    function directionFrom(start, target) { return cg.Utils.normalize(target.x - start.x, target.y - start.y); }
    function maxVisual() { return cg.Utils.isTouchDevice() ? cg.Constants.MAX_RENDER_PROJECTILES_MOBILE : cg.Constants.MAX_RENDER_PROJECTILES_DESKTOP; }

    Battle.canvas = null;
    Battle.ctx = null;
    Battle.active = false;
    Battle.paused = false;
    Battle.orientation = "portrait";
    Battle.width = 0;
    Battle.height = 0;
    Battle.dpr = 1;
    Battle.levelNumber = 1;
    Battle.levelData = null;
    Battle.player = null;
    Battle.enemy = null;
    Battle.gates = [];
    Battle.projectiles = [];
    Battle.projectilePool = new cg.Projectile.Pool();
    Battle.aim = { x: .5, y: .12 };
    Battle.elapsed = 0;
    Battle.cooldown = 0;
    Battle.skillCooldown = 0;
    Battle.slowTimer = 0;
    Battle.comboTimer = 0;
    Battle.stats = null;
    Battle.ai = null;

    Battle.init = function (targetCanvas) {
        canvas = targetCanvas; ctx = canvas.getContext("2d", { alpha: false });
        Battle.canvas = canvas; Battle.ctx = ctx; refreshPalette(); Battle.resize();
    };
    Battle.refreshPalette = refreshPalette;
    Battle.resize = function () {
        if (!canvas) return;
        var rect = canvas.getBoundingClientRect();
        var width = Math.max(320, Math.floor(rect.width || canvas.clientWidth || 640));
        var height = Math.max(240, Math.floor(rect.height || canvas.clientHeight || 480));
        var nextOrientation = width >= height ? "landscape" : "portrait";
        var changed = Battle.orientation !== nextOrientation;
        Battle.width = width; Battle.height = height; Battle.dpr = cg.Utils.getDpr(); Battle.orientation = nextOrientation;
        canvas.width = Math.floor(width * Battle.dpr); canvas.height = Math.floor(height * Battle.dpr);
        if (changed && Battle.active && Battle.levelData) Battle.gates = cg.Gate.create(Battle.levelData, Battle.orientation, cg.Difficulty.get(root.GameState.settings.difficulty).gateBias);
        refreshPalette();
    };
    Battle.getPlayerOrigin = function () { return origin("player"); };
    Battle.getEnemyOrigin = function () { return origin("enemy"); };
    Battle.getOrientation = function () { return Battle.orientation; };
    Battle.start = function (levelNumber) {
        if (!canvas) return;
        var number = Math.max(1, Math.min(cg.Level.count, Number(levelNumber) || 1));
        Battle.levelNumber = number; Battle.levelData = cg.Level.get(number); Battle.active = true; Battle.paused = false; Battle.elapsed = 0; Battle.cooldown = 0; Battle.skillCooldown = 0; Battle.slowTimer = 0; Battle.comboTimer = 0; Battle.stats = { shots: 0, hits: 0, damage: 0, maxMultiplier: 1, combo: 0, time: 0 };
        Battle.player = cg.Castle.create("player", Battle.levelData, root.GameState.settings.difficulty, root.GameState.save && root.GameState.save.playerStats);
        Battle.enemy = cg.Castle.create("enemy", Battle.levelData, root.GameState.settings.difficulty);
        Battle.aim = Battle.getEnemyOrigin(); Battle.resize(); Battle.gates = cg.Gate.create(Battle.levelData, Battle.orientation, cg.Difficulty.get(root.GameState.settings.difficulty).gateBias); Battle.projectiles.length = 0; Battle.projectilePool.clear(); cg.Particles.reset(); cg.Camera.reset(); Battle.ai = cg.EnemyAI.create(Battle);
        root.GameState.battle = Battle; cg.State.setScreen(cg.Constants.SCREENS.GAME); if (cg.Audio) { cg.Audio.ensure(); cg.Audio.startBgm("battle"); }
        if (cg.Hud) cg.Hud.refresh();
    };
    Battle.restart = function () { Battle.start(Battle.levelNumber); };
    Battle.pause = function () { if (!Battle.active || Battle.paused) return; Battle.paused = true; cg.State.setScreen(cg.Constants.SCREENS.PAUSE); if (cg.Audio) cg.Audio.setPaused(true); if (cg.ScreenManager) cg.ScreenManager.show(cg.Constants.SCREENS.PAUSE); };
    Battle.resume = function () { if (!Battle.active) return; Battle.paused = false; cg.State.setScreen(cg.Constants.SCREENS.GAME); if (cg.Audio) cg.Audio.setPaused(false); if (cg.ScreenManager) cg.ScreenManager.show(cg.Constants.SCREENS.GAME); };
    Battle.pauseForVisibility = function () { if (Battle.active && !Battle.paused) Battle.pause(); };
    Battle.setAim = function (x, y) {
        var target = { x: cg.Utils.clamp(x, .04, .96), y: cg.Utils.clamp(y, .04, .96) };
        if (Battle.orientation === "portrait") target.y = Math.min(target.y, .8); else target.x = Math.max(target.x, .2);
        Battle.aim = target; if (cg.Hud) cg.Hud.setAim(target);
    };
    Battle.adjustAim = function (dx, dy) { Battle.setAim(Battle.aim.x + dx, Battle.aim.y + dy); };
    Battle.spawn = function (source, target) {
        if (Battle.projectilePool.activeCount() >= maxVisual()) return null;
        var start = origin(source); var direction = directionFrom(start, target || targetFor(source)); var castle = source === "player" ? Battle.player : Battle.enemy; var projectile = Battle.projectilePool.acquire(); var critical = source === "player" && Math.random() < castle.criticalRate; var damage = castle.attack * (critical ? 2 : 1);
        projectile.launch(source, start.x, start.y, direction, castle.projectileSpeed, damage, 1); projectile.critical = critical; projectile.refreshVisualCount(maxVisual()); Battle.projectiles.push(projectile); castle.recoil = .18; Battle.stats.shots += source === "player" ? 1 : 0; cg.Particles.burst(start.x, start.y, source === "player" ? palette.primary : palette.accent, 7, .12); cg.Audio.playSfx("fire", critical ? 1.4 : 1); return projectile;
    };
    Battle.firePlayer = function () { if (!Battle.active || Battle.paused || Battle.cooldown > 0) return false; Battle.spawn("player", Battle.aim); Battle.cooldown = 1 / Battle.player.fireRate; if (cg.Hud) cg.Hud.refresh(); return true; };
    Battle.fireEnemy = function (target) { if (!Battle.active || Battle.paused) return false; Battle.spawn("enemy", target || Battle.getPlayerOrigin()); return true; };
    Battle.useSkill = function () {
        if (!Battle.active || Battle.paused || Battle.skillCooldown > 0) return false;
        Battle.skillCooldown = cg.Constants.SKILL_COOLDOWN; Battle.slowTimer = 4.8; cg.Particles.burst(Battle.getPlayerOrigin().x, Battle.getPlayerOrigin().y, palette.success, 28, .25); cg.Particles.shockwave(Battle.getPlayerOrigin().x, Battle.getPlayerOrigin().y, palette.success); cg.Audio.playSfx("skill", 1.2); if (cg.Toast) cg.Toast.show(cg.I18n.t("toast.skill"), "success"); if (cg.Hud) cg.Hud.refresh(); return true;
    };
    Battle.processGate = function (projectile, gate) {
        var result = cg.Gate.apply(gate, projectile); projectile.refreshVisualCount(maxVisual()); Battle.stats.maxMultiplier = Math.max(Battle.stats.maxMultiplier, projectile.multiplier); Battle.stats.combo += 1; Battle.comboTimer = 1.7; var color = gate.type === "divide" ? palette.danger : gate.special ? palette.secondary : palette.primary; cg.Particles.burst(gate.x, gate.y, color, gate.type === "divide" ? 15 : 23, .18); cg.Particles.text(gate.x, gate.y - .035, result.factor >= 1 ? "x" + cg.Utils.formatNumber(result.factor) : "÷" + gate.value, color); cg.Audio.playSfx(gate.type === "divide" ? "hit" : result.factor >= 10 ? "multiplier" : "gate", Math.min(2, result.factor)); if (result.factor >= 10) { cg.Particles.text(gate.x, gate.y - .085, cg.I18n.t("game.megashot"), palette.secondary); cg.Camera.impactZoom(1.035); cg.Camera.shake(.045); } if (cg.Hud) cg.Hud.showCombo(Battle.stats.combo, projectile.multiplier); if (cg.Toast && result.factor >= 5) cg.Toast.show(cg.I18n.t("toast.gate", { value: "x" + cg.Utils.formatNumber(result.factor) }), "success");
    };
    Battle.hitCastle = function (projectile, targetSide) {
        var target = targetSide === "enemy" ? Battle.enemy : Battle.player; var point = targetSide === "enemy" ? Battle.getEnemyOrigin() : Battle.getPlayerOrigin(); var defenseReduction = target.defense * Math.min(8, projectile.logicalCount); var damage = Math.max(1, projectile.damageTotal - defenseReduction); var dealt = target.takeDamage(damage); Battle.stats.damage += dealt; Battle.stats.hits += projectile.source === "player" ? 1 : 0; var color = targetSide === "enemy" ? palette.secondary : palette.danger; cg.Particles.burst(point.x, point.y, color, projectile.logicalCount > 20 ? 25 : 14, .2); cg.Particles.shockwave(point.x, point.y, color); cg.Particles.text(point.x, point.y - .07, "-" + cg.Utils.formatNumber(dealt), color); cg.Camera.shake(projectile.logicalCount > 20 ? .055 : .022); cg.Audio.playSfx(projectile.logicalCount > 20 ? "explosion" : "hit", projectile.logicalCount > 20 ? 1.4 : 1); if (projectile.logicalCount > 20) cg.Camera.impactZoom(1.03); if (target.hp <= 0) Battle.end(targetSide === "enemy" ? "win" : "lose");
    };
    Battle.update = function (delta) {
        if (!Battle.active || Battle.paused) return;
        var dt = Math.min(cg.Constants.MAX_DELTA, Math.max(0, delta)); var slowFactor = Battle.slowTimer > 0 ? .46 : 1; var simDt = dt * slowFactor; Battle.elapsed += dt; Battle.stats.time += dt; Battle.cooldown = Math.max(0, Battle.cooldown - dt); Battle.skillCooldown = Math.max(0, Battle.skillCooldown - dt); Battle.slowTimer = Math.max(0, Battle.slowTimer - dt); Battle.comboTimer -= dt; if (Battle.comboTimer <= 0) Battle.stats.combo = 0;
        Battle.gates.forEach(function (gate) { cg.Gate.update(gate, simDt, Battle.elapsed); }); if (Battle.ai) Battle.ai.update(simDt);
        for (var i = Battle.projectiles.length - 1; i >= 0; i -= 1) {
            var projectile = Battle.projectiles[i]; if (!projectile.active) { Battle.projectiles.splice(i, 1); continue; }
            projectile.life += simDt; projectile.prevX = projectile.x; projectile.prevY = projectile.y; projectile.vy += .14 * simDt; projectile.x += projectile.vx * simDt; projectile.y += projectile.vy * simDt; if (projectile.trail.length > 7) projectile.trail.shift(); projectile.trail.push({ x: projectile.x, y: projectile.y }); if (Math.random() < .72) cg.Particles.trail(projectile.x, projectile.y, projectile.source === "player" ? palette.primary : palette.accent);
            var consumed = false;
            for (var g = 0; g < Battle.gates.length; g += 1) { var gate = Battle.gates[g]; if (!gate.active || projectile.passedGates[gate.id] || !cg.Collision.segmentVsRect(projectile.prevX, projectile.prevY, projectile.x, projectile.y, cg.Gate.rect(gate))) continue; projectile.passedGates[gate.id] = true; Battle.processGate(projectile, gate); consumed = false; }
            var targetSide = projectile.source === "player" ? "enemy" : "player"; if (cg.Collision.projectileHitsCastle(projectile, targetSide === "enemy" ? Battle.getEnemyOrigin() : Battle.getPlayerOrigin(), targetSide === "enemy" ? Battle.enemy.radius : Battle.player.radius)) { Battle.hitCastle(projectile, targetSide); consumed = true; }
            if (!Battle.active) break;
            if (projectile.life > 5 || projectile.x < -.12 || projectile.x > 1.12 || projectile.y < -.12 || projectile.y > 1.12) consumed = true;
            if (consumed) { projectile.active = false; Battle.projectiles.splice(i, 1); Battle.projectilePool.release(projectile); }
        }
        Battle.player.recoil = Math.max(0, Battle.player.recoil - dt); Battle.enemy.recoil = Math.max(0, Battle.enemy.recoil - dt); Battle.player.hitFlash = Math.max(0, Battle.player.hitFlash - dt); Battle.enemy.hitFlash = Math.max(0, Battle.enemy.hitFlash - dt); cg.Particles.update(simDt); cg.Camera.update(dt); if (cg.Hud) cg.Hud.refresh();
    };
    Battle.end = function (outcome) {
        if (!Battle.active) return; Battle.active = false; Battle.paused = false; var snapshot = Battle.getStats(); snapshot.level = Battle.levelNumber; cg.SaveManager.recordBattle(outcome, Battle.levelNumber, snapshot); cg.State.setScreen(outcome === "win" ? cg.Constants.SCREENS.RESULT_WIN : cg.Constants.SCREENS.RESULT_LOSE); if (cg.Audio) { cg.Audio.setPaused(false); cg.Audio.startForScreen(root.GameState.screen); cg.Audio.playSfx(outcome === "win" ? "victory" : "defeat"); } if (cg.Result) cg.Result.show(outcome, snapshot); if (cg.ScreenManager) cg.ScreenManager.show(root.GameState.screen); Battle.projectiles.forEach(function (p) { Battle.projectilePool.release(p); }); Battle.projectiles.length = 0; if (outcome === "win") { var p = Battle.getEnemyOrigin(); cg.Particles.burst(p.x, p.y, palette.secondary, 50, .35); } else { var q = Battle.getPlayerOrigin(); cg.Particles.burst(q.x, q.y, palette.primary, 20, .18); }
    };
    Battle.getStats = function () { return Object.assign({}, Battle.stats || {}, { level: Battle.levelNumber, hitRate: Battle.stats && Battle.stats.shots ? Battle.stats.hits / Battle.stats.shots : 0 }); };
    Battle.forceWin = function () { if (Battle.active) { Battle.enemy.hp = 0; Battle.end("win"); } };
    Battle.forceLose = function () { if (Battle.active) { Battle.player.hp = 0; Battle.end("lose"); } };

    Battle.render = function () {
        if (!ctx || !Battle.width || !Battle.height) return; var width = Battle.width; var height = Battle.height; ctx.setTransform(Battle.dpr, 0, 0, Battle.dpr, 0, 0); ctx.clearRect(0, 0, width, height); refreshPalette(); var offset = cg.Camera.offset(width, height); var zoom = cg.Camera.state.zoom; ctx.save(); ctx.translate(width / 2 + offset.x, height / 2 + offset.y); ctx.scale(zoom, zoom); ctx.translate(-width / 2, -height / 2); drawBackground(width, height); drawTrajectory(width, height); Battle.gates.forEach(function (gate) { drawGate(gate, width, height); }); if (Battle.enemy) drawCastle(Battle.enemy, width, height); if (Battle.player) drawCastle(Battle.player, width, height); Battle.projectiles.forEach(function (p) { drawProjectile(p, width, height); }); cg.Particles.draw(ctx, width, height); ctx.restore();
    };
    function drawBackground(width, height) {
        var gradient = ctx.createLinearGradient(0, 0, 0, height); gradient.addColorStop(0, palette.skyTop); gradient.addColorStop(1, palette.skyBottom); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
        var isNight = Battle.levelData && Battle.levelData.weather === "night"; ctx.globalAlpha = isNight ? .75 : .9; ctx.fillStyle = palette.sun; ctx.beginPath(); ctx.arc(width * (Battle.orientation === "portrait" ? .78 : .72), height * .18, Math.min(width, height) * .085, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        drawCloud(width * .18, height * .19, width * .16, .45); drawCloud(width * .75, height * .3, width * .13, .3); drawCloud(width * .5, height * .11, width * .1, .2);
        drawHill(width, height, .53, palette.hillBack, .07); drawHill(width, height, .68, palette.hillFront, .09); ctx.fillStyle = palette.ground; ctx.beginPath(); ctx.moveTo(0, height * .78); ctx.lineTo(width, height * .78); ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(0, height * .78, width, 2);
        var weather = Battle.levelData && Battle.levelData.weather; if (weather === "rain") drawRain(width, height); if (weather === "snow") drawSnow(width, height); if (weather === "night") drawStars(width, height);
        ctx.fillStyle = "rgba(4, 13, 32, .15)"; ctx.fillRect(0, height * .81, width, height * .19);
    }
    function drawCloud(x, y, size, opacity) { ctx.save(); ctx.globalAlpha = opacity; ctx.fillStyle = "#e8f5ff"; ctx.beginPath(); ctx.arc(x, y, size * .25, Math.PI, 0); ctx.arc(x + size * .2, y - size * .06, size * .34, Math.PI, 0); ctx.arc(x + size * .48, y, size * .25, Math.PI, 0); ctx.lineTo(x + size * .73, y + size * .18); ctx.lineTo(x - size * .08, y + size * .18); ctx.closePath(); ctx.fill(); ctx.restore(); }
    function drawHill(width, height, base, color, variance) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, height * base); for (var i = 0; i <= 12; i += 1) { var x = width * (i / 12); var y = height * (base - .12 - Math.sin(i * 1.7 + Battle.levelNumber) * variance - (i % 3) * .018); ctx.lineTo(x, y); } ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath(); ctx.fill(); }
    function drawRain(width, height) { ctx.save(); ctx.strokeStyle = "rgba(180, 229, 255, .25)"; ctx.lineWidth = 1.2; for (var i = 0; i < 28; i += 1) { var x = ((i * 89 + Battle.elapsed * 80) % (width + 80)) - 40; var y = (i * 47) % height; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); ctx.stroke(); } ctx.restore(); }
    function drawSnow(width, height) { ctx.save(); ctx.fillStyle = "rgba(255,255,255,.55)"; for (var i = 0; i < 22; i += 1) { var x = (i * 71 + Math.sin(Battle.elapsed * .5 + i) * 20) % width; var y = (i * 43 + Battle.elapsed * 18) % height; ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
    function drawStars(width, height) { ctx.save(); ctx.fillStyle = palette.secondary; for (var i = 0; i < 28; i += 1) { var x = (i * 113) % width; var y = (i * 47) % (height * .58); var a = .35 + .35 * Math.sin(Battle.elapsed * 2 + i); ctx.globalAlpha = a; ctx.fillRect(x, y, 2, 2); } ctx.restore(); }
    function drawTrajectory(width, height) {
        if (!Battle.active || Battle.paused) return; var start = Battle.getPlayerOrigin(); var dir = directionFrom(start, Battle.aim); var velocity = cg.Constants.PLAYER_PROJECTILE_SPEED; var count = root.GameState.settings.difficulty === "hard" ? 10 : 16; ctx.save(); ctx.setLineDash([4, 10]); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,.42)"; ctx.beginPath(); for (var i = 0; i <= count; i += 1) { var t = i * .09; var x = start.x + dir.x * velocity * t; var y = start.y + dir.y * velocity * t + .5 * .14 * t * t; if (i === 0) ctx.moveTo(x * width, y * height); else ctx.lineTo(x * width, y * height); } ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = palette.secondary; ctx.beginPath(); ctx.arc(Battle.aim.x * width, Battle.aim.y * height, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    function drawGate(gate, width, height) {
        var rect = cg.Gate.rect(gate); var x = rect.x * width; var y = rect.y * height; var w = rect.w * width; var h = rect.h * height; var color = gate.type === "divide" ? palette.danger : gate.special ? palette.secondary : palette.primary; ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = root.GameState.settings.graphicsQuality === "low" ? 0 : 24; roundedRect(ctx, x, y, w, h, Math.min(14, Math.min(w, h) * .4)); ctx.fill(); ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.strokeStyle = color; ctx.lineWidth = gate.flash > 0 ? 5 : 2; roundedRect(ctx, x, y, w, h, Math.min(14, Math.min(w, h) * .4)); ctx.stroke(); ctx.fillStyle = palette.panel; roundedRect(ctx, x + 4, y + 4, Math.max(2, w - 8), Math.max(2, h - 8), Math.min(10, Math.min(w, h) * .3)); ctx.fill(); ctx.strokeStyle = color; ctx.globalAlpha = .7; ctx.lineWidth = 1; roundedRect(ctx, x + 8, y + 8, Math.max(2, w - 16), Math.max(2, h - 16), Math.min(8, Math.min(w, h) * .25)); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.font = "900 " + Math.max(16, Math.min(width, height) * .045) + "px Trebuchet MS, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(5, 12, 32, .9)"; var label = (gate.type === "divide" ? "÷" : "x") + gate.value; ctx.strokeText(label, gate.x * width, gate.y * height); ctx.fillText(label, gate.x * width, gate.y * height); ctx.font = "900 " + Math.max(12, Math.min(width, height) * .027) + "px Arial, sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(gate.icon || "↑", gate.x * width, gate.y * height + (gate.portrait ? h * .72 : h * .64)); ctx.restore(); }
    function drawCastle(castle, width, height) {
        var point = castle.side === "player" ? Battle.getPlayerOrigin() : Battle.getEnemyOrigin(); var x = point.x * width; var y = point.y * height; var scale = Math.min(width, height); var towerW = scale * .055; var bodyW = scale * .13; var bodyH = scale * .12; var recoil = castle.recoil * scale * .08; var base = castle.side === "player" ? palette.primary : palette.accent; var roof = castle.side === "player" ? palette.success : palette.danger; ctx.save(); ctx.translate(x, y + recoil); ctx.globalAlpha = .35; ctx.fillStyle = "#071329"; ctx.beginPath(); ctx.ellipse(0, scale * .05, bodyW * 1.1, scale * .025, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = "#8c9db8"; roundedRect(ctx, -bodyW / 2, -bodyH / 2, bodyW, bodyH, 8); ctx.fill(); ctx.strokeStyle = "#e7ddb3"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = base; roundedRect(ctx, -bodyW * .39, -bodyH * .29, bodyW * .78, bodyH * .58, 5); ctx.fill(); [-.52, .52].forEach(function (offset) { ctx.fillStyle = "#9aa9c1"; roundedRect(ctx, offset * bodyW - towerW / 2, -bodyH * .76, towerW, bodyH * .92, 4); ctx.fill(); ctx.strokeStyle = "#e7ddb3"; ctx.stroke(); ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(offset * bodyW - towerW * .65, -bodyH * .76); ctx.lineTo(offset * bodyW, -bodyH * 1.08); ctx.lineTo(offset * bodyW + towerW * .65, -bodyH * .76); ctx.closePath(); ctx.fill(); }); ctx.fillStyle = "#283b63"; roundedRect(ctx, -bodyW * .12, bodyH * .05, bodyW * .24, bodyH * .45, 3); ctx.fill(); ctx.fillStyle = castle.side === "player" ? palette.secondary : "#ffb3c3"; ctx.fillRect(bodyW * .18, -bodyH * .98, 2, bodyH * .38); ctx.beginPath(); ctx.moveTo(bodyW * .2, -bodyH * .98); ctx.lineTo(bodyW * .2 + bodyW * .38, -bodyH * .88); ctx.lineTo(bodyW * .2, -bodyH * .76); ctx.closePath(); ctx.fill(); if (castle.hitFlash > 0) { ctx.globalAlpha = castle.hitFlash / .24 * .45; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, bodyW * .8, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
    function drawProjectile(projectile, width, height) {
        var x = projectile.x * width; var y = projectile.y * height; var color = projectile.source === "player" ? palette.primary : palette.accent; var count = Math.min(projectile.visualCount, 24); var size = Math.max(3, Math.min(width, height) * (.008 + Math.min(1.2, Math.log(projectile.logicalCount + 1) * .0015))); ctx.save(); ctx.lineCap = "round"; if (projectile.trail.length > 1) { ctx.strokeStyle = color; ctx.globalAlpha = .28; ctx.lineWidth = size * 1.6; ctx.beginPath(); projectile.trail.forEach(function (point, index) { if (index === 0) ctx.moveTo(point.x * width, point.y * height); else ctx.lineTo(point.x * width, point.y * height); }); ctx.stroke(); } ctx.globalAlpha = 1; for (var i = 0; i < count; i += 1) { var angle = (i / Math.max(1, count)) * Math.PI * 2 + projectile.seed; var spread = count === 1 ? 0 : Math.min(size * 2.6, size * (1 + Math.log(count))); var px = x + Math.cos(angle) * spread; var py = y + Math.sin(angle) * spread; ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = root.GameState.settings.graphicsQuality === "low" ? 0 : 14; ctx.beginPath(); ctx.arc(px, py, size * (i === 0 ? 1.05 : .55), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; } ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x - size * .28, y - size * .28, Math.max(1.2, size * .28), 0, Math.PI * 2); ctx.fill(); if (projectile.logicalCount > 1) { ctx.fillStyle = palette.secondary; ctx.font = "800 " + Math.max(11, size * 2.2) + "px Arial, sans-serif"; ctx.textAlign = "left"; ctx.fillText("x" + cg.Utils.formatNumber(projectile.logicalCount), x + size * 1.3, y - size * 1.3); } ctx.restore(); }
}(window));
