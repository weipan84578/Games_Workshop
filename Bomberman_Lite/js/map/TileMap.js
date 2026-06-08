(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;
  const TILE = root.TILE;

  class TileMap {
    constructor(grid, hidden, meta) {
      this.grid = grid;
      this.hidden = hidden || {};
      this.meta = meta || {};
      this.width = root.CONFIG.mapW;
      this.height = root.CONFIG.mapH;
      this.exitRevealed = false;
    }

    inBounds(x, y) {
      return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    get(x, y) {
      if (!this.inBounds(x, y)) return TILE.WALL;
      return this.grid[y][x];
    }

    set(x, y, value) {
      if (this.inBounds(x, y)) this.grid[y][x] = value;
    }

    isBorder(x, y) {
      return x <= 0 || y <= 0 || x >= this.width - 1 || y >= this.height - 1;
    }

    isWalkable(x, y, allowPhase) {
      const value = this.get(x, y);
      if (allowPhase) return this.inBounds(x, y) && !this.isBorder(x, y);
      return value === TILE.FLOOR || value === TILE.EXIT || value === TILE.POWERUP || value === TILE.FLAME;
    }

    destroyBrick(x, y) {
      if (this.get(x, y) !== TILE.BRICK) return null;
      const key = H.tileKey(x, y);
      const hidden = this.hidden[key] || null;
      delete this.hidden[key];
      if (hidden && hidden.kind === "exit") {
        this.set(x, y, TILE.EXIT);
        this.exitRevealed = true;
      } else {
        this.set(x, y, TILE.FLOOR);
      }
      return hidden;
    }

    findHiddenExit() {
      const keys = Object.keys(this.hidden);
      for (let i = 0; i < keys.length; i += 1) {
        if (this.hidden[keys[i]].kind === "exit") return H.parseKey(keys[i]);
      }
      return null;
    }

    revealExitFallback() {
      if (this.exitRevealed) return null;
      const hiddenExit = this.findHiddenExit();
      if (hiddenExit) {
        delete this.hidden[H.tileKey(hiddenExit.x, hiddenExit.y)];
        this.set(hiddenExit.x, hiddenExit.y, TILE.EXIT);
        this.exitRevealed = true;
        return hiddenExit;
      }
      for (let y = this.height - 2; y >= 1; y -= 1) {
        for (let x = this.width - 2; x >= 1; x -= 1) {
          if (this.get(x, y) === TILE.FLOOR) {
            this.set(x, y, TILE.EXIT);
            this.exitRevealed = true;
            return { x, y };
          }
        }
      }
      return null;
    }

    static generate(level) {
      const rng = H.mulberry32(9173 + level.stage * 811);
      const width = root.CONFIG.mapW;
      const height = root.CONFIG.mapH;
      const grid = [];
      const hidden = {};
      const safe = new Set(["1,1", "2,1", "1,2", "2,2", "3,1", "1,3"]);
      const density = level.density || 0.4;

      for (let y = 0; y < height; y += 1) {
        const row = [];
        for (let x = 0; x < width; x += 1) {
          if (x === 0 || y === 0 || x === width - 1 || y === height - 1 || (x % 2 === 0 && y % 2 === 0)) {
            row.push(TILE.WALL);
          } else {
            row.push(TILE.FLOOR);
          }
        }
        grid.push(row);
      }

      safe.forEach((key) => {
        const cell = H.parseKey(key);
        if (cell.x > 0 && cell.y > 0 && cell.x < width - 1 && cell.y < height - 1) {
          grid[cell.y][cell.x] = TILE.FLOOR;
        }
      });

      if (level.pattern === "boss") {
        for (let y = 1; y < height - 1; y += 1) {
          for (let x = 1; x < width - 1; x += 1) {
            if (grid[y][x] !== TILE.WALL || (x % 2 === 0 && y % 2 === 0 && rng() < 0.35)) {
              grid[y][x] = TILE.FLOOR;
            }
          }
        }
      }

      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const key = H.tileKey(x, y);
          if (safe.has(key) || grid[y][x] !== TILE.FLOOR) continue;
          if (level.pattern === "cross" && (x === 7 || y === 6)) continue;
          if (level.pattern === "ring" && (x === 2 || x === 12 || y === 2 || y === 10)) continue;
          if (rng() < density) grid[y][x] = TILE.BRICK;
        }
      }

      if (level.pattern === "cross") {
        for (let x = 1; x < width - 1; x += 1) grid[6][x] = TILE.FLOOR;
        for (let y = 1; y < height - 1; y += 1) grid[y][7] = TILE.FLOOR;
      }

      if (level.pattern === "ring") {
        for (let x = 2; x <= 12; x += 1) {
          grid[2][x] = TILE.FLOOR;
          grid[10][x] = TILE.FLOOR;
        }
        for (let y = 2; y <= 10; y += 1) {
          grid[y][2] = TILE.FLOOR;
          grid[y][12] = TILE.FLOOR;
        }
      }

      const floorCells = [];
      const brickCells = [];
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const key = H.tileKey(x, y);
          if (safe.has(key)) continue;
          const distance = Math.abs(x - 1) + Math.abs(y - 1);
          if (distance < 6) continue;
          if (grid[y][x] === TILE.FLOOR) floorCells.push({ x, y });
          if (grid[y][x] === TILE.BRICK) brickCells.push({ x, y });
        }
      }

      const spawnCells = H.shuffle(rng, floorCells).slice(0, Math.max(1, level.enemies.length));
      const fallbackSpawns = [
        { x: 13, y: 11 },
        { x: 13, y: 1 },
        { x: 1, y: 11 },
        { x: 11, y: 9 },
        { x: 9, y: 11 },
        { x: 7, y: 9 },
        { x: 11, y: 3 },
        { x: 5, y: 11 },
        { x: 13, y: 5 }
      ];
      while (spawnCells.length < level.enemies.length) {
        spawnCells.push(fallbackSpawns[spawnCells.length % fallbackSpawns.length]);
      }
      spawnCells.forEach((cell) => {
        grid[cell.y][cell.x] = TILE.FLOOR;
        root.DIRECTIONS.forEach((dir) => {
          const nx = cell.x + dir.x;
          const ny = cell.y + dir.y;
          if (nx > 0 && ny > 0 && nx < width - 1 && ny < height - 1 && grid[ny][nx] !== TILE.WALL) {
            grid[ny][nx] = TILE.FLOOR;
          }
        });
      });

      const shuffledBricks = H.shuffle(rng, brickCells);
      const exitCell = shuffledBricks.shift() || floorCells[floorCells.length - 1] || { x: width - 2, y: height - 2 };
      if (grid[exitCell.y][exitCell.x] === TILE.BRICK) {
        hidden[H.tileKey(exitCell.x, exitCell.y)] = { kind: "exit" };
      } else {
        grid[exitCell.y][exitCell.x] = TILE.EXIT;
      }

      const powerups = level.powerups || [];
      powerups.forEach((type, index) => {
        const cell = shuffledBricks[index] || H.choose(rng, floorCells);
        if (!cell) return;
        if (grid[cell.y][cell.x] === TILE.BRICK) {
          hidden[H.tileKey(cell.x, cell.y)] = { kind: "powerup", type };
        } else {
          hidden[H.tileKey(cell.x, cell.y)] = { kind: "powerup", type };
          grid[cell.y][cell.x] = TILE.BRICK;
        }
      });

      return new TileMap(grid, hidden, {
        stage: level.stage,
        name: level.name,
        timeLimit: level.timeLimit,
        enemySpawns: spawnCells
      });
    }
  }

  root.TileMap = TileMap;
}());
