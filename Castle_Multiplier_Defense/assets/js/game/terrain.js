(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Terrain = (cg.Terrain = {});
  var kinds = ["rock", "tree", "crystal"];

  function overlaps(a, b, padding) {
    return (
      a.x - padding < b.x + b.w &&
      a.x + a.w + padding > b.x &&
      a.y - padding < b.y + b.h &&
      a.y + a.h + padding > b.y
    );
  }

  function candidate(index, orientation) {
    var portrait = orientation === "portrait";
    var depthBand =
      cg.Constants.TERRAIN_DEPTH_BANDS[
        index % cg.Constants.TERRAIN_DEPTH_BANDS.length
      ];
    var depth = cg.Utils.rand(depthBand[0], depthBand[1]);
    var lateral = cg.Utils.rand(0.08, 0.92);
    var width = portrait ? cg.Utils.rand(0.1, 0.15) : cg.Utils.rand(0.07, 0.12);
    var height = portrait
      ? cg.Utils.rand(0.07, 0.12)
      : cg.Utils.rand(0.1, 0.15);

    return {
      x: (portrait ? lateral : depth) - width / 2,
      y: (portrait ? depth : lateral) - height / 2,
      w: width,
      h: height,
      lateral: lateral,
      depth: depth,
      width: width,
      height: height,
    };
  }

  Terrain.create = function (orientation, gates, protectedPoints) {
    var count = cg.Utils.randInt(
      cg.Constants.TERRAIN_MIN_COUNT,
      cg.Constants.TERRAIN_MAX_COUNT,
    );
    var items = [];
    var attempts = 0;

    while (items.length < count && attempts < count * 120) {
      var index = items.length;
      var item = candidate(index, orientation);
      var blockedByGate = (gates || []).some(function (gate) {
        return overlaps(item, cg.Gate.rect(gate), 0.045);
      });
      var blockedGateLane = (gates || []).some(function (gate) {
        var lateral = item.lateral;
        var gateLateral = orientation === "portrait" ? gate.x : gate.y;
        var halfSize =
          orientation === "portrait" ? item.width / 2 : item.height / 2;
        var depthHalfSize =
          orientation === "portrait" ? item.height / 2 : item.width / 2;
        var gateDepthHalfSize =
          orientation === "portrait" ? gate.h / 2 : gate.w / 2;
        var sameDepth =
          Math.abs(item.depth - gate.depth) <
          depthHalfSize + gateDepthHalfSize + 0.012;

        return sameDepth && Math.abs(lateral - gateLateral) < halfSize + 0.012;
      });
      var blockedByTerrain = items.some(function (other) {
        return overlaps(item, Terrain.rect(other), 0.045);
      });
      var tooCloseToCastle = (protectedPoints || []).some(function (point) {
        return (
          Math.hypot(
            item.x + item.w / 2 - point.x,
            item.y + item.h / 2 - point.y,
          ) < 0.16
        );
      });

      attempts += 1;
      if (
        blockedByGate ||
        blockedGateLane ||
        blockedByTerrain ||
        tooCloseToCastle
      )
        continue;

      items.push({
        id: "terrain-" + items.length + "-" + Math.round(Math.random() * 9999),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        lateral: item.lateral,
        depth: item.depth,
        width: item.width,
        height: item.height,
        kind: cg.Utils.choose(kinds),
        tone: Math.random(),
        durability: cg.Utils.randInt(2, 3),
        active: true,
        hitFlash: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    return items;
  };

  Terrain.reflow = function (items, orientation) {
    var portrait = orientation === "portrait";

    (items || []).forEach(function (item) {
      item.x = (portrait ? item.lateral : item.depth) - item.width / 2;
      item.y = (portrait ? item.depth : item.lateral) - item.height / 2;
      item.w = item.width;
      item.h = item.height;
    });
  };

  Terrain.rect = function (item) {
    return {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    };
  };

  Terrain.findHit = function (items, x1, y1, x2, y2) {
    for (var index = 0; index < (items || []).length; index += 1) {
      var item = items[index];
      if (
        item.active &&
        cg.Collision.segmentVsRect(x1, y1, x2, y2, Terrain.rect(item))
      )
        return item;
    }

    return null;
  };

  Terrain.absorb = function (item) {
    if (!item || !item.active) return false;

    item.durability -= 1;
    item.hitFlash = 0.24;
    if (item.durability <= 0) item.active = false;
    return !item.active;
  };

  Terrain.update = function (items, dt, elapsed) {
    (items || []).forEach(function (item) {
      if (!item.active) return;
      item.hitFlash = Math.max(0, item.hitFlash - dt);
      if (item.kind === "tree") {
        item.sway = Math.sin(elapsed * 0.8 + item.phase) * 0.008;
      } else {
        item.sway = 0;
      }
    });
  };

  Terrain.draw = function (item, context, width, height, palette, quality) {
    if (!item.active) return;

    var x = item.x * width;
    var y = item.y * height;
    var w = item.w * width;
    var h = item.h * height;
    var color =
      item.kind === "tree"
        ? palette.success
        : item.kind === "crystal"
          ? palette.primary
          : palette.secondary;

    context.save();
    context.translate(x + w / 2, y + h / 2);
    context.rotate(item.sway || 0);
    context.globalAlpha = item.hitFlash > 0 ? 0.55 : 1;
    context.shadowColor = color;
    context.shadowBlur = quality === "low" ? 0 : 12;

    context.fillStyle = "rgba(5, 17, 37, .38)";
    context.beginPath();
    context.ellipse(0, h * 0.42, w * 0.52, h * 0.15, 0, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    if (item.kind === "tree") {
      context.fillStyle = "#76563b";
      context.fillRect(-w * 0.1, -h * 0.02, w * 0.2, h * 0.46);
      context.fillStyle = color;
      [-0.24, 0.12, 0].forEach(function (offset, index) {
        context.globalAlpha = 0.72 + index * 0.08;
        context.beginPath();
        context.arc(
          offset * w,
          -h * (0.12 + index * 0.11),
          w * 0.3,
          0,
          Math.PI * 2,
        );
        context.fill();
      });
    } else if (item.kind === "crystal") {
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(-w * 0.42, h * 0.34);
      context.lineTo(-w * 0.2, -h * 0.42);
      context.lineTo(0, -h * 0.12);
      context.lineTo(w * 0.2, -h * 0.54);
      context.lineTo(w * 0.46, h * 0.34);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(255,255,255,.5)";
      context.beginPath();
      context.moveTo(-w * 0.12, -h * 0.28);
      context.lineTo(0, -h * 0.08);
      context.lineTo(-w * 0.04, h * 0.2);
      context.closePath();
      context.fill();
    } else {
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(-w * 0.48, h * 0.3);
      context.lineTo(-w * 0.28, -h * 0.28);
      context.lineTo(w * 0.08, -h * 0.48);
      context.lineTo(w * 0.48, h * 0.26);
      context.lineTo(w * 0.2, h * 0.46);
      context.closePath();
      context.fill();
      context.strokeStyle = "rgba(255,255,255,.28)";
      context.lineWidth = 1.5;
      context.stroke();
    }

    context.globalAlpha = 0.3;
    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.beginPath();
    context.ellipse(0, h * 0.28, w * 0.62, h * 0.5, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  };

  Terrain.drawAll = function (items, context, width, height, palette, quality) {
    (items || []).forEach(function (item) {
      Terrain.draw(item, context, width, height, palette, quality);
    });
  };
})(window);
