(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  function isDanger(game, tile) {
    if (game.explosions.some((explosion) => explosion.containsTile(tile.x, tile.y))) return true;
    return game.bombs.some((bomb) => {
      if (bomb.timer > 950 && !bomb.remote) return false;
      if (bomb.x === tile.x && bomb.y === tile.y) return true;
      if (bomb.x !== tile.x && bomb.y !== tile.y) return false;
      const dx = Math.sign(tile.x - bomb.x);
      const dy = Math.sign(tile.y - bomb.y);
      const distance = Math.abs(tile.x - bomb.x) + Math.abs(tile.y - bomb.y);
      if (distance > bomb.range) return false;
      for (let i = 1; i <= distance; i += 1) {
        const tx = bomb.x + dx * i;
        const ty = bomb.y + dy * i;
        const value = game.map.get(tx, ty);
        if (value === root.TILE.WALL) return false;
        if (value === root.TILE.BRICK && i < distance && !bomb.pierce) return false;
      }
      return true;
    });
  }

  function passable(game, tile, phase) {
    if (!game.map.isWalkable(tile.x, tile.y, phase)) return false;
    if (game.bombAt(tile.x, tile.y)) return false;
    return true;
  }

  function findPath(game, start, goal, phase) {
    const queue = [start];
    const seen = new Set([H.tileKey(start.x, start.y)]);
    const prev = {};
    let found = null;

    while (queue.length) {
      const current = queue.shift();
      if (current.x === goal.x && current.y === goal.y) {
        found = current;
        break;
      }
      root.DIRECTIONS.forEach((dir) => {
        const next = { x: current.x + dir.x, y: current.y + dir.y };
        const key = H.tileKey(next.x, next.y);
        if (seen.has(key) || !passable(game, next, phase)) return;
        seen.add(key);
        prev[key] = current;
        queue.push(next);
      });
    }

    if (!found) return null;
    let step = found;
    while (prev[H.tileKey(step.x, step.y)] && !(prev[H.tileKey(step.x, step.y)].x === start.x && prev[H.tileKey(step.x, step.y)].y === start.y)) {
      step = prev[H.tileKey(step.x, step.y)];
    }
    return { x: Math.sign(step.x - start.x), y: Math.sign(step.y - start.y) };
  }

  function randomDirection(game, tile, phase, rng, avoidDanger) {
    const options = root.DIRECTIONS
      .filter((dir) => passable(game, { x: tile.x + dir.x, y: tile.y + dir.y }, phase))
      .filter((dir) => !avoidDanger || !isDanger(game, { x: tile.x + dir.x, y: tile.y + dir.y }));
    if (!options.length) return { x: 0, y: 0 };
    const choice = H.choose(rng, options);
    return { x: choice.x, y: choice.y };
  }

  const EnemyAI = {
    choose(enemy, game) {
      const tile = H.centerTile(enemy);
      const playerTile = H.centerTile(game.player);
      const rng = enemy.rng;
      const ai = root.ENEMY_TYPES[enemy.type].ai;
      const phase = enemy.phase;
      const dangerHere = isDanger(game, tile);

      if (dangerHere || ai === root.AI_LEVEL.AVOID_BOMB || ai === root.AI_LEVEL.SMART || ai === root.AI_LEVEL.SUPER) {
        const safe = randomDirection(game, tile, phase, rng, true);
        if (dangerHere || (safe.x || safe.y) && rng() < 0.45) return safe;
      }

      if (ai === root.AI_LEVEL.CHASE || ai === root.AI_LEVEL.SMART || ai === root.AI_LEVEL.SUPER) {
        const path = findPath(game, tile, playerTile, phase);
        if (path && (path.x || path.y) && rng() < (ai === root.AI_LEVEL.CHASE ? 0.62 : 0.86)) {
          return path;
        }
      }

      if (ai === root.AI_LEVEL.PHASE && rng() < 0.5) {
        const path = findPath(game, tile, playerTile, true);
        if (path) return path;
      }

      return randomDirection(game, tile, phase, rng, false);
    },

    isDanger
  };

  root.EnemyAI = EnemyAI;
}());
