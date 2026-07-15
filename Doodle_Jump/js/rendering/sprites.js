(function (Game) {
  "use strict";
  function roundedRect(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }
  function player(ctx, player, x, y, time) {
    ctx.save();
    var bob = Math.sin(time * 0.012) * 1.5;
    var scaleY = player.squash > 0 ? 1 - player.squash * 0.5 : 1;
    ctx.translate(x + player.width / 2, y + player.height / 2 + bob);
    ctx.scale(player.facing, scaleY);
    if (player.hurtTimer > 0 && Math.floor(time / 70) % 2 === 0)
      ctx.globalAlpha = 0.45;
    if (player.buffs.shield > 0) {
      ctx.strokeStyle = "rgba(96,224,255,.85)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 29, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (player.buffs.rocket > 0) {
      ctx.fillStyle = "#ff895e";
      ctx.beginPath();
      ctx.moveTo(-9, 19);
      ctx.quadraticCurveTo(0, 38 + Math.sin(time * 0.02) * 5, 9, 19);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd0a6";
    ctx.strokeStyle = "#19324b";
    ctx.lineWidth = 3;
    roundedRect(ctx, -15, -19, 30, 34, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ff8cae";
    ctx.beginPath();
    ctx.ellipse(-12, -7, 6, 10, -0.4, 0, Math.PI * 2);
    ctx.ellipse(12, -7, 6, 10, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#19324b";
    ctx.beginPath();
    ctx.arc(-6, -3, 2.3, 0, Math.PI * 2);
    ctx.arc(6, -3, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 5, 5, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#6fcef2";
    roundedRect(ctx, -19, 10, 38, 12, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function platform(ctx, platform, x, y, time) {
    if (!platform.active) return;
    var alpha =
      platform.type === "vanishing" && platform.vanishTimer > 0
        ? Math.min(1, platform.vanishTimer / 2)
        : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = platform.color;
    ctx.strokeStyle = "#19324b";
    ctx.lineWidth = 3;
    roundedRect(
      ctx,
      x,
      y,
      platform.width,
      platform.height,
      platform.type === "cloud" ? 9 : 6,
    );
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.5)";
    roundedRect(ctx, x + 7, y + 3, Math.max(8, platform.width - 14), 5, 3);
    ctx.fill();
    if (platform.type === "moving") {
      ctx.fillStyle = "#19324b";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("↔", x + platform.width / 2, y + 13);
    }
    if (platform.type === "brittle") {
      ctx.strokeStyle = "#6d3f2d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + platform.width * 0.28, y + 2);
      ctx.lineTo(x + platform.width * 0.38, y + 14);
      ctx.lineTo(x + platform.width * 0.5, y + 5);
      ctx.lineTo(x + platform.width * 0.68, y + 15);
      ctx.stroke();
    }
    if (platform.type === "spring") {
      ctx.strokeStyle = "#b57512";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + platform.width / 2 - 12, y);
      ctx.quadraticCurveTo(
        x + platform.width / 2 - 5,
        y - 23,
        x + platform.width / 2 + 3,
        y,
      );
      ctx.quadraticCurveTo(
        x + platform.width / 2 + 10,
        y - 23,
        x + platform.width / 2 + 17,
        y,
      );
      ctx.stroke();
    }
    if (platform.type === "spike") {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      for (var spike = 0; spike < platform.width - 12; spike += 13) {
        ctx.moveTo(x + 6 + spike, y);
        ctx.lineTo(x + 12 + spike, y - 12);
        ctx.lineTo(x + 18 + spike, y);
      }
      ctx.fill();
    }
    ctx.restore();
  }
  function item(ctx, item, x, y, time) {
    if (!item.active) return;
    var bob = Math.sin(time * 0.006 + item.phase) * 3;
    ctx.save();
    ctx.translate(x + item.width / 2, y + item.height / 2 + bob);
    ctx.shadowColor = item.type === "lucky" ? "#ffd45c" : "#fff";
    ctx.shadowBlur = 12;
    ctx.fillStyle =
      item.type === "star" || item.type === "lucky"
        ? "#ffd45c"
        : item.type === "shield"
          ? "#5bd6ed"
          : item.type === "rocket"
            ? "#ff8a5d"
            : item.type === "spring"
              ? "#ff9cc5"
              : item.type === "magnet"
                ? "#b18cf4"
                : "#71d5ce";
    ctx.strokeStyle = "#19324b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (item.type === "star" || item.type === "lucky") {
      for (var i = 0; i < 10; i += 1) {
        var radius = i % 2 ? 7 : 12;
        var angle = -Math.PI / 2 + (i * Math.PI) / 5;
        var px = Math.cos(angle) * radius;
        var py = Math.sin(angle) * radius;
        if (!i) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else {
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function enemy(ctx, enemy, x, y, time) {
    if (!enemy.active) return;
    ctx.save();
    ctx.translate(x + enemy.width / 2, y + enemy.height / 2);
    if (enemy.type === "hole") {
      ctx.fillStyle = "#282346";
      ctx.strokeStyle = "#ff7a90";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 22 + Math.sin(time * 0.01) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#ae91ff";
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 1.6);
      ctx.stroke();
    } else {
      ctx.fillStyle = enemy.type === "flyer" ? "#8d7bea" : "#e986a8";
      ctx.strokeStyle = "#19324b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-5, -2, 4, 0, Math.PI * 2);
      ctx.arc(5, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#19324b";
      ctx.beginPath();
      ctx.arc(-5, -2, 1.5, 0, Math.PI * 2);
      ctx.arc(5, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#19324b";
      ctx.beginPath();
      ctx.arc(0, 3, 5, 0, Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }
  Game.Sprites = Object.freeze({
    roundedRect: roundedRect,
    player: player,
    platform: platform,
    item: item,
    enemy: enemy,
  });
})(window.DJGame);
