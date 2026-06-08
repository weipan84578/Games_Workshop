(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  function tilesForRect(rect) {
    const ts = root.CONFIG.tileSize;
    const inset = 4;
    const left = Math.floor((rect.x + inset) / ts);
    const right = Math.floor((rect.x + rect.w - inset) / ts);
    const top = Math.floor((rect.y + inset) / ts);
    const bottom = Math.floor((rect.y + rect.h - inset) / ts);
    const tiles = [];
    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        tiles.push({ x, y });
      }
    }
    return tiles;
  }

  root.CollisionDetector = {
    aabb: H.rectsOverlap,
    tilesForRect
  };
}());
